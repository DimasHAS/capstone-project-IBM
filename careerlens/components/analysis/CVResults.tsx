"use client";
import React from "react";
import { CheckCircle, AlertCircle, TrendingUp, User, Award } from "lucide-react";
import type { CVAnalysis } from "@/types";
import { ScoreBar, Badge, Card, DemoBanner } from "@/components/ui";

interface CVResultsProps {
  analysis: CVAnalysis;
  isDemo: boolean;
}

const scoreLabels: Record<string, string> = {
  structure: "Struktur & Keterbacaan",
  summary: "Ringkasan Profesional",
  skills: "Relevansi Skill",
  experience: "Kualitas Pengalaman",
  achievements: "Pencapaian & Dampak",
  education: "Pendidikan & Sertifikasi",
  keywords: "Keyword Relevansi",
};

const scoreWeights: Record<string, number> = {
  structure: 15,
  summary: 15,
  skills: 20,
  experience: 25,
  achievements: 10,
  education: 10,
  keywords: 5,
};

export default function CVResults({ analysis, isDemo }: CVResultsProps) {
  const { overallScore, scoreBreakdown, profile, strengths, weaknesses, missingInfo, improvements } = analysis;

  const scoreColor =
    overallScore >= 75 ? "text-green-600" : overallScore >= 50 ? "text-amber-600" : "text-red-600";
  const scoreLabel =
    overallScore >= 80 ? "Sangat Baik" : overallScore >= 65 ? "Baik" : overallScore >= 50 ? "Cukup" : "Perlu Perbaikan";

  return (
    <div className="space-y-6">
      {isDemo && <DemoBanner />}

      {/* Overall Score */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="text-center">
            <div className={`text-6xl font-bold ${scoreColor}`}>{overallScore}</div>
            <div className="text-slate-500 text-sm">dari 100</div>
            <div className={`text-sm font-semibold mt-1 ${scoreColor}`}>{scoreLabel}</div>
          </div>
          <div className="flex-1 space-y-3 w-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-800">Penilaian Kualitas CV (AI-Assisted)</h3>
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Bukan skor ATS resmi</span>
            </div>
            {Object.entries(scoreBreakdown).map(([key, val]) => (
              <ScoreBar
                key={key}
                label={`${scoreLabels[key] || key} (bobot ${scoreWeights[key] || 0}%)`}
                score={val}
              />
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-4 border-t border-slate-100 pt-3">
          * Skor ini adalah penilaian berbasis AI dan tidak mewakili skor sistem ATS manapun secara resmi.
          Gunakan sebagai panduan untuk memperbaiki CV kamu.
        </p>
      </Card>

      {/* Profile */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <User size={18} className="text-blue-600" />
          <h3 className="font-bold text-slate-800">Profil Kandidat</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          {profile.fullName && (
            <div><span className="text-slate-500">Nama:</span> <span className="font-medium ml-1">{profile.fullName}</span></div>
          )}
          {profile.email && (
            <div><span className="text-slate-500">Email:</span> <span className="font-medium ml-1">{profile.email}</span></div>
          )}
          {profile.phone && (
            <div><span className="text-slate-500">Telepon:</span> <span className="font-medium ml-1">{profile.phone}</span></div>
          )}
          {profile.location && (
            <div><span className="text-slate-500">Lokasi:</span> <span className="font-medium ml-1">{profile.location}</span></div>
          )}
          {profile.linkedIn && (
            <div className="sm:col-span-2"><span className="text-slate-500">LinkedIn:</span> <span className="font-medium ml-1">{profile.linkedIn}</span></div>
          )}
        </div>

        {profile.summary && (
          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1 font-medium">RINGKASAN</p>
            <p className="text-sm text-slate-700">{profile.summary}</p>
          </div>
        )}

        {/* Education */}
        {profile.education.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Pendidikan</p>
            {profile.education.map((edu, i) => (
              <div key={i} className="text-sm text-slate-700">
                <span className="font-medium">{edu.institution}</span>
                {edu.degree && ` — ${edu.degree} ${edu.field}`}
                {edu.graduationYear && ` (${edu.graduationYear})`}
                {edu.gpa && <span className="text-slate-500"> · IPK {edu.gpa}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {profile.technicalSkills.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Keterampilan Teknis</p>
            <div className="flex flex-wrap gap-2">
              {profile.technicalSkills.map((s) => (
                <Badge key={s} variant="blue">{s}</Badge>
              ))}
            </div>
          </div>
        )}
        {profile.softSkills.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Soft Skills</p>
            <div className="flex flex-wrap gap-2">
              {profile.softSkills.map((s) => (
                <Badge key={s} variant="purple">{s}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {profile.certifications.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Sertifikasi</p>
            <div className="flex flex-wrap gap-2">
              {profile.certifications.map((c) => (
                <Badge key={c} variant="amber">{c}</Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Strengths & Weaknesses */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={16} className="text-green-600" />
            <h3 className="font-bold text-slate-800">Kekuatan CV</h3>
          </div>
          <ul className="space-y-2">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={16} className="text-amber-600" />
            <h3 className="font-bold text-slate-800">Area Perbaikan</h3>
          </div>
          <ul className="space-y-2">
            {weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                {w}
              </li>
            ))}
          </ul>
          {missingInfo.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-2">INFORMASI YANG HILANG</p>
              {missingInfo.map((m, i) => (
                <p key={i} className="text-xs text-slate-500 flex items-start gap-1">
                  <span>•</span>{m}
                </p>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Improvements */}
      {improvements.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-blue-600" />
            <h3 className="font-bold text-slate-800">Rekomendasi Perbaikan Spesifik</h3>
          </div>
          <div className="space-y-4">
            {improvements.map((imp, i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-4 space-y-2">
                <div className="bg-red-50 border border-red-100 rounded p-2">
                  <p className="text-xs font-semibold text-red-600 mb-1">KALIMAT ASLI</p>
                  <p className="text-sm text-slate-700 italic">&ldquo;{imp.original}&rdquo;</p>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded p-2">
                  <p className="text-xs font-semibold text-amber-600 mb-1">MASALAH</p>
                  <p className="text-sm text-slate-700">{imp.problem}</p>
                </div>
                <div className="bg-green-50 border border-green-100 rounded p-2">
                  <p className="text-xs font-semibold text-green-600 mb-1">REKOMENDASI</p>
                  <p className="text-sm text-slate-700">{imp.recommendation}</p>
                </div>
                <p className="text-xs text-slate-500">💡 {imp.reason}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Projects */}
      {profile.projects.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Award size={16} className="text-purple-600" />
            <h3 className="font-bold text-slate-800">Proyek</h3>
          </div>
          <div className="space-y-3">
            {profile.projects.map((p, i) => (
              <div key={i} className="border-l-2 border-purple-200 pl-3">
                <p className="font-medium text-slate-800 text-sm">{p.name}</p>
                {p.description && <p className="text-xs text-slate-500 mt-0.5">{p.description}</p>}
                {p.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.technologies.map((t) => (
                      <Badge key={t} variant="gray">{t}</Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
