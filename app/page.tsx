import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center p-6">
      <h1 className="text-3xl font-semibold">Devis App</h1>
      <p className="mt-2 text-neutral-600">Module de demande de devis pour agence de desinfection/deratisation.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/devis" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
          Faire une demande
        </Link>
        <Link href="/admin" className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50">
          Back-office
        </Link>
      </div>
    </main>
  );
}
