"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useDebounce } from "@/hooks/use-debounce";

type DevisRow = {
  id: string;
  created_at: string;
  etablissement: string;
  surface: number;
  nuisibles: string[];
  urgence: string;
  nom: string;
  email: string;
  telephone: string | null;
  message: string | null;
  statut: "nouveau" | "traite" | "archive";
};

export function AdminDashboard({ initialData }: { initialData: DevisRow[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [rows, setRows] = useState(initialData);
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [status, setStatus] = useState(searchParams.get("statut") ?? "all");
  const debouncedQ = useDebounce(q, 300);

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const matchesStatus = status === "all" ? true : row.statut === status;
      const text = `${row.nom} ${row.email}`.toLowerCase();
      const matchesQ = debouncedQ ? text.includes(debouncedQ.toLowerCase()) : true;
      return matchesStatus && matchesQ;
    });
  }, [rows, status, debouncedQ]);

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const clampedPage = Math.min(Math.max(1, page), totalPages);
  const pageRows = filtered.slice((clampedPage - 1) * pageSize, clampedPage * pageSize);

  function setParam(name: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (!value) next.delete(name);
    else next.set(name, value);
    next.set("page", "1");
    router.replace(`/admin?${next.toString()}`);
  }

  async function updateStatus(id: string, nextStatus: DevisRow["statut"]) {
    const response = await fetch(`/api/admin/devis/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: nextStatus }),
    });

    if (!response.ok) return;

    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, statut: nextStatus } : row)));
  }

  function exportCsv() {
    const header = ["id", "date", "nom", "email", "etablissement", "statut"];
    const lines = filtered.map((r) => [r.id, r.created_at, r.nom, r.email, r.etablissement, r.statut]);
    const csv = [header, ...lines]
      .map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "devis.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row">
        <Input
          placeholder="Rechercher par nom ou email"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setParam("q", e.target.value);
          }}
        />
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setParam("statut", e.target.value === "all" ? "" : e.target.value);
          }}
        >
          <option value="all">Tous</option>
          <option value="nouveau">Nouveau</option>
          <option value="traite">Traite</option>
          <option value="archive">Archive</option>
        </Select>
        <Button type="button" variant="secondary" onClick={exportCsv}>Exporter CSV</Button>
        <Button type="button" variant="secondary" onClick={logout}>Deconnexion</Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-neutral-200">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Nom</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Etablissement</th>
              <th className="px-3 py-2 text-left">Statut</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={row.id} className="border-t border-neutral-200">
                <td className="px-3 py-2">{new Date(row.created_at).toLocaleString()}</td>
                <td className="px-3 py-2">{row.nom}</td>
                <td className="px-3 py-2">{row.email}</td>
                <td className="px-3 py-2">{row.etablissement}</td>
                <td className="px-3 py-2">
                  <Select
                    value={row.statut}
                    onChange={(e) => updateStatus(row.id, e.target.value as DevisRow["statut"])}
                  >
                    <option value="nouveau">Nouveau</option>
                    <option value="traite">Traite</option>
                    <option value="archive">Archive</option>
                  </Select>
                </td>
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td className="px-3 py-8 text-center text-neutral-500" colSpan={5}>Aucun resultat</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span>Page {clampedPage} / {totalPages}</span>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            disabled={clampedPage <= 1}
            onClick={() => {
              const next = new URLSearchParams(searchParams.toString());
              next.set("page", String(clampedPage - 1));
              router.replace(`/admin?${next.toString()}`);
            }}
          >
            Precedent
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={clampedPage >= totalPages}
            onClick={() => {
              const next = new URLSearchParams(searchParams.toString());
              next.set("page", String(clampedPage + 1));
              router.replace(`/admin?${next.toString()}`);
            }}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
