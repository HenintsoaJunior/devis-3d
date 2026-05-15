import Link from "next/link";

export default function Home() {
  return (
    <main className="page-container" style={{ display: "grid", placeItems: "center", minHeight: "75vh" }}>
      <section className="card" style={{ width: "100%", maxWidth: 760, padding: "var(--spacing-xl)" }}>
        <h1 style={{ margin: 0, fontSize: "var(--font-size-3xl)", color: "var(--brand-primary)" }}>Devis App</h1>
        <p style={{ margin: "var(--spacing-sm) 0 var(--spacing-lg)", color: "var(--text-muted)" }}>
          Module de demande de devis pour agence de desinfection et deratisation.
        </p>
        <div style={{ display: "flex", gap: "var(--spacing-sm)", flexWrap: "wrap" }}>
          <Link href="/devis" className="btn btn-primary">Faire une demande</Link>
          <Link href="/admin" className="btn btn-outline-primary">Back-office</Link>
        </div>
      </section>
    </main>
  );
}
