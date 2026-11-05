import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { ArrowRight, CheckCircle, Upload, Brain, Target, Map } from "lucide-react";

// ============================================================
// Landing Page
// ============================================================

const features = [
  {
    icon: Upload,
    title: "Upload CV Mudah",
    desc: "Unggah CV dalam format PDF atau DOCX, atau tempel teks langsung. Proses aman dan data tidak disimpan.",
  },
  {
    icon: Brain,
    title: "Analisis AI Mendalam",
    desc: "AI menganalisis struktur, konten, dan kualitas CV kamu secara komprehensif dengan skor transparan.",
  },
  {
    icon: Target,
    title: "Job Match Analyzer",
    desc: "Bandingkan CV kamu dengan deskripsi pekerjaan untuk tahu seberapa cocok kamu dengan posisi yang diincar.",
  },
  {
    icon: Map,
    title: "Peta Karir Personal",
    desc: "Dapatkan roadmap belajar dan rekomendasi karir yang dipersonalisasi berdasarkan profil kamu.",
  },
];

const steps = [
  { num: "01", title: "Upload CV", desc: "Unggah CV kamu dalam format PDF, DOCX, atau tempel teks langsung." },
  { num: "02", title: "Analisis AI", desc: "AI menganalisis CV secara mendalam dan menghasilkan laporan terstruktur." },
  { num: "03", title: "Bandingkan Job", desc: "Tempel deskripsi pekerjaan target untuk melihat skor kecocokan." },
  { num: "04", title: "Ambil Tindakan", desc: "Ikuti rekomendasi spesifik dan roadmap karir yang dipersonalisasi." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e3a5f] via-[#1e40af] to-[#4f46e5] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-100 text-sm px-4 py-1.5 rounded-full mb-6">
            <span>✨</span>
            <span>AI-Powered Career Advisor</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Optimalkan CV Kamu dengan{" "}
            <span className="text-yellow-300">Kecerdasan Buatan</span>
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            CareerLens menganalisis CV kamu, membandingkannya dengan lowongan pekerjaan, menemukan gap keterampilan,
            dan memberikan rekomendasi karir yang actionable — semua dalam hitungan detik.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/analyzer"
              className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-[#1e3a5f] font-bold px-8 py-3.5 rounded-xl transition-colors text-lg"
            >
              Analisis CV Saya
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/analyzer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-8 py-3.5 rounded-xl transition-colors text-lg"
            >
              Coba Demo Gratis
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-blue-200 text-sm">
            {["✓ Gratis & Tanpa Daftar", "✓ Data Tidak Disimpan", "✓ Mode Demo Tersedia", "✓ Bahasa Indonesia"].map(
              (item) => (
                <span key={item}>{item}</span>
              )
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Cara Kerja CareerLens</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Empat langkah sederhana menuju CV yang lebih kuat dan peluang karir yang lebih besar.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.num} className="text-center p-6 rounded-xl border border-slate-100 bg-slate-50">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Fitur Unggulan</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Semua yang kamu butuhkan untuk mengoptimalkan perjalanan karir dalam satu platform.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <f.icon size={22} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview card */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Contoh Hasil Analisis</h2>
            <p className="text-slate-500">Inilah yang kamu dapatkan setelah menganalisis CV.</p>
          </div>
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Skor Kualitas CV</p>
                <p className="text-4xl font-bold text-blue-600">78</p>
                <p className="text-xs text-slate-400">dari 100</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                {[
                  { label: "Job Match", val: "82%", color: "text-green-600" },
                  { label: "Skill Match", val: "75%", color: "text-blue-600" },
                  { label: "Skill Gap", val: "4", color: "text-amber-600" },
                  { label: "Saran", val: "7+", color: "text-purple-600" },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-lg p-2 border border-slate-200">
                    <p className={`text-xl font-bold ${item.color}`}>{item.val}</p>
                    <p className="text-xs text-slate-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: "Struktur CV", val: 78 },
                { label: "Kualitas Pengalaman", val: 70 },
                { label: "Relevansi Skill", val: 80 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-medium">{item.val}/100</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${item.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {["Node.js ✓", "Python ✓", "Docker ✓", "Kubernetes ✗", "PostgreSQL ✗"].map((skill) => (
                <span
                  key={skill}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    skill.includes("✓") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-[#1e3a5f] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Siap untuk Meningkatkan CV Kamu?</h2>
          <p className="text-blue-200 mb-8 text-lg">
            Mulai analisis CV gratis sekarang. Tidak perlu mendaftar, tidak perlu credit card.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/analyzer"
              className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-[#1e3a5f] font-bold px-8 py-3.5 rounded-xl transition-colors text-lg"
            >
              Mulai Sekarang — Gratis
              <ArrowRight size={20} />
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-blue-300 text-sm">
            {[
              <CheckCircle key="1" size={14} className="inline mr-1" />,
              <CheckCircle key="2" size={14} className="inline mr-1" />,
              <CheckCircle key="3" size={14} className="inline mr-1" />,
            ]}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-6 text-blue-300 text-sm">
            <span>✓ Gratis sepenuhnya</span>
            <span>✓ Data tidak disimpan</span>
            <span>✓ Mode demo tersedia</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 text-center text-sm">
        <p className="font-medium text-white mb-1">CareerLens</p>
        <p>AI-Powered CV Analyzer &amp; Career Advisor — Capstone Project Informatika</p>
        <p className="mt-2 text-slate-500 text-xs">Data CV tidak disimpan di server. Privasi kamu terlindungi.</p>
      </footer>
    </div>
  );
}
