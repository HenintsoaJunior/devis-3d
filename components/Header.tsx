"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/admin/login") {
    return null;
  }

  return (
    <nav className="fixed top-0 right-0 p-4 flex gap-3 z-50">
      <Link
        href="/admin"
        className={`text-[11px] font-bold uppercase tracking-wider py-1.5 px-3 rounded backdrop-blur-sm border transition-all ${pathname.startsWith("/admin")
          ? "bg-blue-700 text-white border-blue-700 shadow-sm"
          : "bg-white/50 text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-700"
          }`}
      >
        Admin
      </Link>
      <Link
        href="/"
        className={`text-[11px] font-bold uppercase tracking-wider py-1.5 px-3 rounded transition-all shadow-sm ${pathname === "/"
          ? "bg-blue-700 text-white hover:bg-blue-800"
          : "bg-white/50 text-slate-500 border border-slate-200 hover:border-blue-300 hover:text-blue-700 backdrop-blur-sm"
          }`}
      >
        Devis
      </Link>
    </nav>
  );
}
