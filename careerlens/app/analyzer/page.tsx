"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, ArrowRight, FileText } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import CVUploader from "@/components/cv/CVUploader";
import CVResults from "@/components/analysis/CVResults";
import { LoadingSpinner, Card, Alert, EmptyState } from "@/components/ui";
import { useApp } from "@/lib/app-context";

export default function AnalyzerPage() {
  const router = useRouter();
  const { cvText, fileName, cvAnalysis, isDemo, setCVText, setCVAnalysis } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtracted = (text: string, name: string) => {
    setCVText(text, name);
    setError(null);
  };

  const analyzeCV = async () => {
    if (!cvText) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menganalisis CV.");
      setCVAnalysis(json.data, json.demo);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={22} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-800">Analisis CV</h1>
          </div>
          <p className="text-slate-500">
            Upload atau tempel teks CV kamu, lalu biarkan AI menganalisis kualitas dan memberikan rekomendasi.
          </p>
        </div>

        {/* Upload section */}
        {!cvAnalysis && (
          <Card className="p-6 mb-6">
            <h2 className="font-bold text-slate-800 mb-4">Langkah 1 — Masukkan CV Kamu</h2>
            <CVUploader onExtracted={handleExtracted} />

            {cvText && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      ✓ CV siap dianalisis:{" "}
                      <span className="text-blue-600">{fileName}</span>
                    </p>
                    <p className="text-xs text-slate-400">{cvText.length} karakter diekstrak</p>
                  </div>
                </div>
                {error && <Alert variant="error" className="mb-3">{error}</Alert>}
                <button
                  onClick={analyzeCV}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      AI sedang menganalisis CV...
                    </>
                  ) : (
                    <>
                      <Brain size={18} />
                      Analisis CV dengan AI
                    </>
                  )}
                </button>
              </div>
            )}
          </Card>
        )}

        {loading && <LoadingSpinner text="AI sedang menganalisis CV kamu secara mendalam..." />}

        {/* Results */}
        {cvAnalysis && !loading && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Hasil Analisis CV</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => { setCVAnalysis(null as any, false); }}
                  className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5 border border-slate-200 rounded-lg"
                >
                  Analisis Ulang
                </button>
                <button
                  onClick={() => router.push("/job-match")}
                  className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-700"
                >
                  Lanjut Job Match <ArrowRight size={14} />
                </button>
              </div>
            </div>
            <CVResults analysis={cvAnalysis} isDemo={isDemo} />
          </>
        )}

        {/* Empty state */}
        {!cvText && !loading && !cvAnalysis && (
          <EmptyState
            icon={<FileText />}
            title="Belum ada CV"
            description="Upload file PDF/DOCX atau tempel teks CV kamu di atas untuk memulai analisis."
          />
        )}
      </main>
    </div>
  );
}
