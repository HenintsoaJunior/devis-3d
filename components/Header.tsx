"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 right-0 p-4 flex gap-3 z-50">
      <Link 
        href="/admin" 
        className={`text-[11px] font-bold uppercase tracking-wider py-1.5 px-3 rounded backdrop-blur-sm border transition-all ${
          pathname.startsWith("/admin") 
            ? "bg-blue-700 text-white border-blue-700 shadow-sm" 
            : "bg-white/50 text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-700"
        }`}
      >
        Admin
      </Link>
      <Link 
        href="/" 
        className={`text-[11px] font-bold uppercase tracking-wider py-1.5 px-3 rounded backdrop-blur-sm border transition-all shadow-sm ${
          pathname === "/" 
            ? "bg-blue-700 text-white border-blue-700 shadow-sm" 
            : "bg-white/50 text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-700"
        }`}
      >
        Devis
      </Link>
    </nav>
  );
}
