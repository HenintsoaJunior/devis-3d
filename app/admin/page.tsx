import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("devis")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return (
        <main className="mx-auto w-full max-w-6xl p-6">
          <h1 className="text-2xl font-semibold">Back-office</h1>
          <p className="mt-4 text-red-600">Erreur de chargement des devis.</p>
        </main>
      );
    }

    const last24h = (data ?? []).filter((row) => {
      return new Date(row.created_at).getTime() > Date.now() - 24 * 60 * 60 * 1000;
    }).length;

    return (
      <main className="mx-auto w-full max-w-6xl p-6">
        <h1 className="text-2xl font-semibold">Back-office Devis</h1>
        <p className="mb-6 mt-1 text-sm text-neutral-600">Demandes recues sur 24h: {last24h}</p>
        <AdminDashboard initialData={data ?? []} />
      </main>
    );
  } catch {
    return (
      <main className="mx-auto w-full max-w-6xl p-6">
        <h1 className="text-2xl font-semibold">Back-office</h1>
        <p className="mt-4 text-red-600">Configuration Supabase manquante.</p>
      </main>
    );
  }
}
