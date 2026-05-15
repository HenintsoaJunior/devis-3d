import DevisForm from "@/components/devis/DevisForm";

export default function LandingPage() {
  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
      
      {/* ── Contenu Principal : Formulaire parfaitement centré ── */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-xl animate-in fade-in zoom-in duration-700">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">EXPERT HYGIÈNE 3D</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">Demandez votre devis gratuit en 2 minutes</p>
          </div>
          <DevisForm />
        </div>
      </main>

    </div>
  );
}
