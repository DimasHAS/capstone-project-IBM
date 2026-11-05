"use client";
import React from "react";
import { CheckCircle, XCircle, Plus, TrendingUp } from "lucide-react";
import type { JobMatchAnalysis } from "@/types";
import { ScoreBar, Badge, Card, DemoBanner } from "@/components/ui";

interface JobMatchResultsProps {
  analysis: JobMatchAnalysis;
  isDemo: boolean;
}

export default function JobMatchResults({ analysis, isDemo }: JobMatchResultsProps) {
  const { overallMatch, skillCoverage, experienceMatch, educationMatch, keywordAlignment,
    skillComparison, fitReasons, gaps, improvements } = analysis;

  const matchColor =
    overallMatch >= 75 ? "text-green-600" : overallMatch >= 50 ? "text-amber-600" : "text-red-600";
  const matchLabel =
    overallMatch >= 80 ? "Sangat Cocok" : overallMatch >= 65 ? "Cukup Cocok" : overallMatch >= 50 ? "Perlu Perbaikan" : "Kurang Cocok";

  return (
    <div className="space-y-6">
      {isDemo && <DemoBanner />}

      {/* Overall match */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="text-center flex-shrink-0">
            <div className={`text-6xl font-bold ${matchColor}`}>{overallMatch}%</div>
            <div className="text-slate-500 text-sm">Kecocokan</div>
            <div className={`text-sm font-semibold mt-1 ${matchColor}`}>{matchLabel}</div>
          </div>
          <div className="flex-1 space-y-3 w-full">
            <h3 className="font-bold text-slate-800 mb-3">Rincian Kecocokan</h3>
            <ScoreBar label="Cakupan Skill" score={skillCoverage} />
            <ScoreBar label="Relevansi Pengalaman" score={experienceMatch} />
            <ScoreBar label="Kesesuaian Pendidikan" score={educationMatch} />
            <ScoreBar label="Keselarasan Keyword" score={keywordAlignment} />
          </div>
        </div>
      </Card>

      {/* Skill comparison */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={16} className="text-green-600" />
            <h3 className="font-bold text-slate-800 text-sm">Skill Dimiliki</h3>
          </div>
          <p className="text-xs text-slate-500 mb-2">Ada di CV dan dibutuhkan</p>
          <div className="flex flex-wrap gap-1.5">
            {skillComparison.matched.length > 0 ? (
              skillComparison.matched.map((s) => (
                <Badge key={s} variant="green">{s}</Badge>
              ))
            ) : (
              <p className="text-xs text-slate-400">Tidak terdeteksi</p>
            )}
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <XCircle size={16} className="text-red-600" />
            <h3 className="font-bold text-slate-800 text-sm">Skill Kurang</h3>
          </div>
          <p className="text-xs text-slate-500 mb-2">Dibutuhkan tapi belum ada di CV</p>
          <div className="flex flex-wrap gap-1.5">
            {skillComparison.missing.length > 0 ? (
              skillComparison.missing.map((s) => (
                <Badge key={s} variant="red">{s}</Badge>
              ))
            ) : (
              <p className="text-xs text-green-600">🎉 Semua skill terpenuhi!</p>
            )}
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Plus size={16} className="text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm">Skill Tambahan</h3>
          </div>
          <p className="text-xs text-slate-500 mb-2">Ada di CV tapi tidak diminta</p>
          <div className="flex flex-wrap gap-1.5">
            {skillComparison.additional.length > 0 ? (
              skillComparison.additional.map((s) => (
                <Badge key={s} variant="blue">{s}</Badge>
              ))
            ) : (
              <p className="text-xs text-slate-400">Tidak ada</p>
            )}
          </div>
        </Card>
      </div>

      {/* Fit reasons */}
      {fitReasons.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={16} className="text-green-600" />
            <h3 className="font-bold text-slate-800">Mengapa Kamu Cocok</h3>
          </div>
          <ul className="space-y-2">
            {fitReasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Gaps */}
      {gaps.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <XCircle size={16} className="text-red-500" />
            <h3 className="font-bold text-slate-800">Kesenjangan yang Perlu Ditutup</h3>
          </div>
          <ul className="space-y-2">
            {gaps.map((g, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                {g}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Improvements */}
      {improvements.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-blue-600" />
            <h3 className="font-bold text-slate-800">Strategi Peningkatan</h3>
          </div>
          <ol className="space-y-2">
            {improvements.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </Card>
      )}
    </div>
  );
}
