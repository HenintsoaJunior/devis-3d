import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <main className="page-container">
        <div className="card" style={{ padding: "var(--spacing-lg)" }}>
          <h1 style={{ margin: 0, fontSize: "var(--font-size-2xl)" }}>Back-office</h1>
          <p className="error-message">Configuration Supabase manquante.</p>
        </div>
      </main>
    );
  }

  const { data, error } = await getSupabaseAdmin()
    .from("devis")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="page-container">
        <div className="card" style={{ padding: "var(--spacing-lg)" }}>
          <h1 style={{ margin: 0, fontSize: "var(--font-size-2xl)" }}>Back-office</h1>
          <p className="error-message">Erreur de chargement des devis.</p>
        </div>
      </main>
    );
  }

  const total = (data ?? []).length;

  return (
    <main className="page-container">
      <h1 style={{ margin: 0, fontSize: "var(--font-size-3xl)", color: "var(--brand-primary)" }}>Back-office Devis</h1>
      <p style={{ color: "var(--text-muted)", margin: "var(--spacing-xs) 0 var(--spacing-md)" }}>Demandes totales: {total}</p>
      <AdminDashboard initialData={data ?? []} />
    </main>
  );
}
