"use client";
import React from "react";

// ============================================================
// Shared UI primitives
// ============================================================

// ---- ScoreRing ----
export function ScoreRing({ score, size = 80, label }: { score: number; size?: number; label?: string }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={8} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute">
        <span className="text-lg font-bold" style={{ color }}>
          {score}
        </span>
      </div>
      {label && <span className="text-xs text-slate-500 text-center">{label}</span>}
    </div>
  );
}

// ---- ScoreBar ----
export function ScoreBar({ label, score, max = 100 }: { label: string; score: number; max?: number }) {
  const pct = Math.round((score / max) * 100);
  const color = pct >= 75 ? "bg-green-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-sm">
        <span className="text-slate-700">{label}</span>
        <span className="font-semibold text-slate-800">{score}/{max}</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ---- Badge ----
type BadgeVariant = "green" | "red" | "amber" | "blue" | "purple" | "gray";
const badgeClasses: Record<BadgeVariant, string> = {
  green: "bg-green-100 text-green-800",
  red: "bg-red-100 text-red-800",
  amber: "bg-amber-100 text-amber-800",
  blue: "bg-blue-100 text-blue-800",
  purple: "bg-purple-100 text-purple-800",
  gray: "bg-slate-100 text-slate-700",
};

export function Badge({ children, variant = "gray" }: { children: React.ReactNode; variant?: BadgeVariant }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses[variant]}`}>
      {children}
    </span>
  );
}

// ---- Card ----
export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>{children}</div>
  );
}

// ---- SectionHeader ----
export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
}

// ---- Alert ----
type AlertVariant = "info" | "success" | "warning" | "error";
const alertClasses: Record<AlertVariant, string> = {
  info: "bg-blue-50 border-blue-200 text-blue-800",
  success: "bg-green-50 border-green-200 text-green-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  error: "bg-red-50 border-red-200 text-red-800",
};

export function Alert({
  children,
  variant = "info",
  className = "",
}: {
  children: React.ReactNode;
  variant?: AlertVariant;
  className?: string;
}) {
  return (
    <div className={`border rounded-lg p-4 text-sm ${alertClasses[variant]} ${className}`}>{children}</div>
  );
}

// ---- DemoBanner ----
export function DemoBanner() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center gap-3 text-sm text-amber-800">
      <span className="text-lg">🎭</span>
      <div>
        <strong>Mode Demo Aktif</strong> — Hasil ini menggunakan data sampel karena belum ada API key AI yang dikonfigurasi.{" "}
        <span className="text-amber-600">Lihat README untuk cara mengaktifkan analisis AI nyata.</span>
      </div>
    </div>
  );
}

// ---- LoadingSpinner ----
export function LoadingSpinner({ text = "Memproses..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-slate-500 text-sm">{text}</p>
    </div>
  );
}

// ---- EmptyState ----
export function EmptyState({ icon, title, description, action }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
      <div className="text-slate-300 text-5xl">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
      <p className="text-slate-500 text-sm max-w-sm">{description}</p>
      {action}
    </div>
  );
}

// ---- Tabs ----
export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            active === tab.id
              ? "bg-white text-blue-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
