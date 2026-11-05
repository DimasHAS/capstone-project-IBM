"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, FileText, Briefcase, Compass, Home, RefreshCw } from "lucide-react";
import { useApp } from "@/lib/app-context";

const navLinks = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/analyzer", label: "Analisis CV", icon: FileText },
  { href: "/job-match", label: "Job Match", icon: Briefcase },
  { href: "/career", label: "Karir Advisor", icon: Compass },
  { href: "/report", label: "Laporan", icon: BarChart2 },
];

export default function Navbar() {
  const pathname = usePathname();
  const { cvAnalysis, resetAll } = useApp();

  return (
    <nav className="bg-[#1e3a5f] text-white shadow-lg sticky top-0 z-50 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-sm font-bold">
              CL
            </div>
            <span>CareerLens</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active ? "bg-blue-600 text-white" : "text-blue-100 hover:bg-white/10"
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Reset button (shown only when analysis exists) */}
          {cvAnalysis && (
            <button
              onClick={() => {
                if (confirm("Reset analisis? Semua data CV akan dihapus.")) resetAll();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-blue-200 hover:bg-white/10 transition-colors"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex gap-1 pb-2 overflow-x-auto">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  active ? "bg-blue-600 text-white" : "text-blue-100 hover:bg-white/10"
                }`}
              >
                <Icon size={13} />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
