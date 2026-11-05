"use client";
import React from "react";
import { Printer, RefreshCw, BarChart2, FileText, Briefcase, Compass } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import CVResults from "@/components/analysis/CVResults";
import JobMatchResults from "@/components/job-match/JobMatchResults";
import CareerResults from "@/components/career/CareerResults";
import { EmptyState, DemoBanner } from "@/components/ui";
import { useApp } from "@/lib/app-context";

export default function ReportPage() {
  const { cvAnalysis, jobMatchAnalysis, careerAdvice, isDemo, fileName, resetAll } = useApp();

  if (!cvAnalysis) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <EmptyState
            icon={<BarChart2 />}
            title="Belum ada analisis"
            description="Kamu perlu menganalisis CV terlebih dahulu untuk melihat laporan lengkap."
            action={
              <Link href="/analyzer" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                Mulai Analisis CV
              </Link>
            }
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Print header (only visible when printing) */}
      <div className="print-only p-8 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800">CareerLens — Laporan Analisis CV</h1>
        <p className="text-slate-500 text-sm mt-1">File: {fileName} | Dicetak: {new Date().toLocaleDateString("id-ID")}</p>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 no-print">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 size={22} className="text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-800">Laporan Analisis Lengkap</h1>
            </div>
            <p className="text-slate-500">File: <span className="font-medium">{fileName}</span></p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium"
            >
              <Printer size={16} />
              <span className="hidden sm:inline">Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={() => {
                if (confirm("Reset semua analisis? Data CV akan dihapus.")) resetAll();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium"
            >
              <RefreshCw size={16} />
              <span className="hidden sm:inline">Analisis Baru</span>
            </button>
          </div>
        </div>

        {isDemo && <div className="mb-6"><DemoBanner /></div>}

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Skor CV" value={`${cvAnalysis.overallScore}/100`} icon={<FileText size={18} />} color="text-blue-600" />
          {jobMatchAnalysis && (
            <StatCard label="Job Match" value={`${jobMatchAnalysis.overallMatch}%`} icon={<Briefcase size={18} />} color="text-green-600" />
          )}
          {jobMatchAnalysis && (
            <StatCard
              label="Skill Kurang"
              value={String(jobMatchAnalysis.skillComparison.missing.length)}
              icon={<BarChart2 size={18} />}
              color="text-amber-600"
            />
          )}
          {careerAdvice && (
            <StatCard
              label="Jalur Karir"
              value={String(careerAdvice.careerPaths.length)}
              icon={<Compass size={18} />}
              color="text-purple-600"
            />
          )}
        </div>

        {/* CV Analysis */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-blue-600" />
            <h2 className="text-xl font-bold text-slate-800">Analisis CV</h2>
          </div>
          <CVResults analysis={cvAnalysis} isDemo={isDemo} />
        </section>

        {/* Job Match */}
        {jobMatchAnalysis && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase size={18} className="text-green-600" />
              <h2 className="text-xl font-bold text-slate-800">Analisis Job Match</h2>
            </div>
            <JobMatchResults analysis={jobMatchAnalysis} isDemo={isDemo} />
          </section>
        )}

        {/* Career Advice */}
        {careerAdvice && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Compass size={18} className="text-purple-600" />
              <h2 className="text-xl font-bold text-slate-800">Saran Karir</h2>
            </div>
            <CareerResults advice={careerAdvice} isDemo={isDemo} />
          </section>
        )}

        {/* Missing modules */}
        {(!jobMatchAnalysis || !careerAdvice) && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 no-print">
            <h3 className="font-bold text-blue-800 mb-2">Lengkapi Laporan Kamu</h3>
            <div className="flex flex-wrap gap-3">
              {!jobMatchAnalysis && (
                <Link href="/job-match" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  + Tambahkan Job Match
                </Link>
              )}
              {!careerAdvice && (
                <Link href="/career" className="bg-purple-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  + Tambahkan Saran Karir
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Print footer */}
        <div className="print-only mt-8 pt-4 border-t border-slate-200 text-xs text-slate-400 text-center">
          CareerLens — AI-Powered CV Analyzer &amp; Career Advisor | Laporan ini dibuat secara otomatis oleh AI.
          Gunakan sebagai panduan, bukan jaminan hasil seleksi kerja.
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
      <div className={`flex justify-center mb-2 ${color}`}>{icon}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}
