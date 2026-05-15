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
  const last24hCount = (data ?? []).filter((d) => {
    const created = new Date(d.created_at);
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return created > yesterday;
  }).length;

  return (
    <main className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "var(--spacing-md)" }}>
        <h1 style={{ margin: 0, fontSize: "var(--font-size-3xl)", color: "var(--brand-primary)" }}>Back-office Devis</h1>
        <div style={{ display: "flex", gap: "var(--spacing-lg)" }}>
          <div>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "var(--font-size-sm)" }}>Demandes totales</p>
            <p style={{ margin: 0, fontSize: "var(--font-size-xl)", fontWeight: "bold" }}>{total}</p>
          </div>
          <div>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "var(--font-size-sm)" }}>Dernières 24h</p>
            <p style={{ margin: 0, fontSize: "var(--font-size-xl)", fontWeight: "bold", color: "var(--success-main, #10b981)" }}>{last24hCount}</p>
          </div>
        </div>
      </div>
      <div style={{ margin: "var(--spacing-md) 0" }}></div>
      <AdminDashboard initialData={data ?? []} />
    </main>
  );
}
