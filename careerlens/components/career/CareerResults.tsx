"use client";
import React from "react";
import { Compass, Clock, TrendingUp, CheckSquare } from "lucide-react";
import type { CareerAdvice } from "@/types";
import { Badge, Card, DemoBanner } from "@/components/ui";

interface CareerResultsProps {
  advice: CareerAdvice;
  isDemo: boolean;
}

const priorityBadge = { Tinggi: "red" as const, Sedang: "amber" as const, Rendah: "green" as const };

export default function CareerResults({ advice, isDemo }: CareerResultsProps) {
  const { careerPaths, roadmap, nextSteps } = advice;

  return (
    <div className="space-y-6">
      {isDemo && <DemoBanner />}

      {/* Career Paths */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Compass size={18} className="text-blue-600" />
          <h3 className="font-bold text-slate-800">Jalur Karir yang Direkomendasikan</h3>
        </div>
        <div className="space-y-4">
          {careerPaths.map((path, i) => (
            <div key={i} className="border border-slate-200 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <h4 className="font-bold text-slate-800">{path.title}</h4>
                  </div>
                  <p className="text-sm text-slate-500 mt-1 ml-8">{path.reasoning}</p>
                </div>
              </div>
              <div className="ml-8 mt-3 grid sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Skill Dibutuhkan</p>
                  <div className="flex flex-wrap gap-1.5">
                    {path.requiredSkills.map((s) => (
                      <Badge key={s} variant="blue">{s}</Badge>
                    ))}
                  </div>
                </div>
                {path.missingSkills.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Perlu Dipelajari</p>
                    <div className="flex flex-wrap gap-1.5">
                      {path.missingSkills.map((s) => (
                        <Badge key={s} variant="amber">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {path.growthPotential && (
                <div className="ml-8 mt-2">
                  <span className="text-xs text-slate-500">📈 Potensi: </span>
                  <span className="text-xs text-slate-700">{path.growthPotential}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Roadmap */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-purple-600" />
          <h3 className="font-bold text-slate-800">Roadmap Belajar Personal</h3>
        </div>
        <div className="space-y-6">
          {[
            { key: "shortTerm" as const, label: "Jangka Pendek (0–3 Bulan)", color: "border-green-400 bg-green-50", dot: "bg-green-500" },
            { key: "midTerm" as const, label: "Jangka Menengah (3–6 Bulan)", color: "border-blue-400 bg-blue-50", dot: "bg-blue-500" },
            { key: "longTerm" as const, label: "Jangka Panjang (6–12 Bulan)", color: "border-purple-400 bg-purple-50", dot: "bg-purple-500" },
          ].map(({ key, label, color, dot }) => (
            <div key={key}>
              <div className={`border-l-4 pl-4 py-2 rounded-r-lg ${color} mb-3`}>
                <h4 className="font-bold text-slate-800 text-sm">{label}</h4>
              </div>
              <div className="space-y-3 ml-4">
                {roadmap[key].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
                    <span className={`w-2 h-2 rounded-full ${dot} mt-2 flex-shrink-0`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-slate-800 text-sm">{item.skill}</span>
                        <Badge variant={priorityBadge[item.priority]}>Prioritas {item.priority}</Badge>
                      </div>
                      {item.resource && (
                        <p className="text-xs text-slate-500 mb-1">📚 {item.resource}</p>
                      )}
                      {item.project && (
                        <p className="text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded">
                          💻 Proyek: {item.project}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Next Steps */}
      {nextSteps.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckSquare size={18} className="text-green-600" />
            <h3 className="font-bold text-slate-800">Langkah Nyata Sekarang</h3>
          </div>
          <ol className="space-y-3">
            {nextSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-100 text-green-700 font-bold text-sm flex items-center justify-center">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Card>
      )}
    </div>
  );
}
