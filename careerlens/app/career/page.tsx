"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Compass, ArrowRight } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import CareerResults from "@/components/career/CareerResults";
import { LoadingSpinner, Card, Alert, EmptyState } from "@/components/ui";
import { useApp } from "@/lib/app-context";
import Link from "next/link";

export default function CareerPage() {
  const router = useRouter();
  const { cvText, isDemo, careerAdvice, setCareerAdvice } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interests, setInterests] = useState("");

  const getAdvice = async () => {
    if (!cvText) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/career-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, interests: interests.trim() || undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal mendapatkan saran karir.");
      setCareerAdvice(json.data, json.demo);
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
            icon={<Compass />}
            title="Belum ada CV"
            description="Kamu perlu memasukkan CV terlebih dahulu sebelum bisa mendapatkan saran karir."
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
            <Compass size={22} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-800">Karir Advisor</h1>
          </div>
          <p className="text-slate-500">
            Dapatkan rekomendasi jalur karir dan roadmap belajar yang dipersonalisasi berdasarkan profil CV kamu.
          </p>
        </div>

        {!careerAdvice && (
          <Card className="p-6 mb-6">
            <h2 className="font-bold text-slate-800 mb-4">Personalisasi Saran Karir (Opsional)</h2>
            <label className="text-sm text-slate-600 mb-2 block">
              Minat atau tujuan karir spesifik (opsional):
            </label>
            <textarea
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Contoh: Saya tertarik di bidang AI/ML, atau ingin bekerja di startup teknologi, atau ingin fokus ke backend engineering..."
              rows={3}
              className="w-full border border-slate-300 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            />
            {error && <Alert variant="error" className="mb-3">{error}</Alert>}
            <button
              onClick={getAdvice}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  AI sedang membuat rencana karir...
                </>
              ) : (
                <>
                  <Compass size={18} />
                  Dapatkan Saran Karir
                </>
              )}
            </button>
          </Card>
        )}

        {loading && <LoadingSpinner text="AI sedang merancang roadmap karir yang dipersonalisasi..." />}

        {careerAdvice && !loading && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Saran Karir Personal</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setCareerAdvice(null as any, false)}
                  className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5 border border-slate-200 rounded-lg"
                >
                  Perbarui Saran
                </button>
                <button
                  onClick={() => router.push("/report")}
                  className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-700"
                >
                  Lihat Laporan <ArrowRight size={14} />
                </button>
              </div>
            </div>
            <CareerResults advice={careerAdvice} isDemo={isDemo} />
          </>
        )}
      </main>
    </div>
  );
}
