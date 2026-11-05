"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, ArrowRight, AlertCircle } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import JobMatchResults from "@/components/job-match/JobMatchResults";
import { LoadingSpinner, Card, Alert, EmptyState } from "@/components/ui";
import { useApp } from "@/lib/app-context";
import Link from "next/link";
import { DEMO_JOB_DESCRIPTION } from "@/lib/demo-data";

export default function JobMatchPage() {
  const router = useRouter();
  const { cvText, cvAnalysis, isDemo, jobDescription, jobMatchAnalysis, setJobDescription, setJobMatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jdInput, setJdInput] = useState(jobDescription);

  const analyzeMatch = async () => {
    if (!cvText || !jdInput.trim()) return;
    setLoading(true);
    setError(null);
    setJobDescription(jdInput);
    try {
      const res = await fetch("/api/match-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, jobDescription: jdInput }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menganalisis kecocokan.");
      setJobMatch(json.data, json.demo);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  if (!cvText) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <EmptyState
            icon={<Briefcase />}
            title="Belum ada CV"
            description="Kamu perlu menganalisis CV terlebih dahulu sebelum bisa melakukan Job Match."
            action={
              <Link href="/analyzer" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                Pergi ke Analisis CV
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
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase size={22} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-800">Job Match Analyzer</h1>
          </div>
          <p className="text-slate-500">
            Tempel deskripsi pekerjaan yang kamu incar dan lihat seberapa cocok CV kamu.
          </p>
        </div>

        {/* JD Input */}
        {!jobMatchAnalysis && (
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-slate-800">Deskripsi Pekerjaan Target</h2>
              <button
                onClick={() => setJdInput(DEMO_JOB_DESCRIPTION)}
                className="text-xs text-blue-600 hover:underline"
              >
                Gunakan Contoh JD
              </button>
            </div>
            <textarea
              value={jdInput}
              onChange={(e) => setJdInput(e.target.value)}
              placeholder="Tempel deskripsi pekerjaan di sini (persyaratan, tanggung jawab, kualifikasi)..."
              rows={10}
              className="w-full border border-slate-300 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-slate-400">{jdInput.length} karakter</span>
            </div>

            {!cvAnalysis && (
              <Alert variant="warning" className="mt-3">
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} />
                  CV belum dianalisis. Hasil Job Match tetap bisa dilakukan, namun analisis penuh memerlukan CV yang sudah dianalisis.
                </div>
              </Alert>
            )}

            {error && <Alert variant="error" className="mt-3">{error}</Alert>}

            <button
              onClick={analyzeMatch}
              disabled={loading || jdInput.trim().length < 30}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Menganalisis kecocokan...
                </>
              ) : (
                <>
                  <Briefcase size={18} />
                  Analisis Kecocokan
                </>
              )}
            </button>
          </Card>
        )}

        {loading && <LoadingSpinner text="AI sedang membandingkan CV dengan lowongan pekerjaan..." />}

        {jobMatchAnalysis && !loading && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Hasil Job Match</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setJobMatch(null as any, false)}
                  className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5 border border-slate-200 rounded-lg"
                >
                  Coba JD Lain
                </button>
                <button
                  onClick={() => router.push("/career")}
                  className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-700"
                >
                  Lanjut Karir Advisor <ArrowRight size={14} />
                </button>
              </div>
            </div>
            <JobMatchResults analysis={jobMatchAnalysis} isDemo={isDemo} />
          </>
        )}
      </main>
    </div>
  );
}
