"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
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

function statusBadge(statut: DevisRow["statut"]) {
  if (statut === "traite") return "badge badge-success";
  if (statut === "archive") return "badge badge-neutral";
  return "badge badge-info";
}

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
    const header = ["id", "date", "nom", "email", "etablissement", "nuisibles", "urgence", "statut"];
    const lines = filtered.map((r) => [r.id, r.created_at, r.nom, r.email, r.etablissement, r.nuisibles.join(" | "), r.urgence, r.statut]);
    const csv = [header, ...lines].map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");

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
    <div style={{ display: "grid", gap: "var(--spacing-md)" }}>
      {/* ── Topbar ── */}
      <div className="admin-topbar">
        <Button type="button" variant="danger" size="sm" onClick={logout}>
          <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
          Déconnexion
        </Button>
      </div>

      {/* ── Filters ── */}
      <div className="card filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Recherche</label>
            <Input placeholder="Nom ou email" value={q} onChange={(e) => { setQ(e.target.value); setParam("q", e.target.value); }} />
          </div>
          <div className="filter-group">
            <label>Statut</label>
            <Select value={status} onChange={(e) => { setStatus(e.target.value); setParam("statut", e.target.value === "all" ? "" : e.target.value); }}>
              <option value="all">Tous</option>
              <option value="nouveau">Nouveau</option>
              <option value="traite">Traite</option>
              <option value="archive">Archive</option>
            </Select>
          </div>
          <Button className="filter-action btn-success btn-sm" type="button" variant="primary" onClick={exportCsv}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <path d="M7 10l5 5 5-5" />
              <path d="M12 15V3" />
            </svg>
            Exporter CSV
          </Button>
        </div>
      </div>

      <div className="professional-container">
        <table className="professional-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Etablissement</th>
              <th>Nuisibles</th>
              <th>Urgence</th>
              <th>Statut</th>
              <th style={{ minWidth: "125px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={row.id}>
                <td>{new Date(row.created_at).toLocaleString()}</td>
                <td>{row.nom}</td>
                <td>{row.email}</td>
                <td>{row.etablissement}</td>
                <td>{row.nuisibles.join(", ")}</td>
                <td>{row.urgence}</td>
                <td><span className={statusBadge(row.statut)}>{row.statut}</span></td>
                <td>
                  <Select value={row.statut} onChange={(e) => updateStatus(row.id, e.target.value as DevisRow["statut"])}>
                    <option value="nouveau">Nouveau</option>
                    <option value="traite">Traite</option>
                    <option value="archive">Archive</option>
                  </Select>
                </td>
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--text-muted)" }}>Aucun resultat</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={clampedPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={pageSize}
        onPageChange={(page) => {
          const next = new URLSearchParams(searchParams.toString());
          next.set("page", String(page));
          router.replace(`/admin?${next.toString()}`);
        }}
      />
    </div>
  );
}
