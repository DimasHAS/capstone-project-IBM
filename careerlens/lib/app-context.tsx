"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import type { AppState, CVAnalysis, JobMatchAnalysis, CareerAdvice } from "@/types";

// ============================================================
// Global App State — React Context
// ============================================================

interface AppContextValue extends AppState {
  setCVText: (text: string, fileName: string) => void;
  setCVAnalysis: (analysis: CVAnalysis, demo: boolean) => void;
  setJobDescription: (jd: string) => void;
  setJobMatch: (match: JobMatchAnalysis, demo: boolean) => void;
  setCareerAdvice: (advice: CareerAdvice, demo: boolean) => void;
  resetAll: () => void;
}

const defaultState: AppState = {
  cvText: "",
  fileName: "",
  cvAnalysis: null,
  jobDescription: "",
  jobMatchAnalysis: null,
  careerAdvice: null,
  isDemo: false,
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);

  const setCVText = useCallback((text: string, fileName: string) => {
    setState((s) => ({
      ...s,
      cvText: text,
      fileName,
      cvAnalysis: null,
      jobMatchAnalysis: null,
      careerAdvice: null,
    }));
  }, []);

  const setCVAnalysis = useCallback((analysis: CVAnalysis, demo: boolean) => {
    setState((s) => ({ ...s, cvAnalysis: analysis, isDemo: demo }));
  }, []);

  const setJobDescription = useCallback((jd: string) => {
    setState((s) => ({ ...s, jobDescription: jd, jobMatchAnalysis: null }));
  }, []);

  const setJobMatch = useCallback((match: JobMatchAnalysis, demo: boolean) => {
    setState((s) => ({ ...s, jobMatchAnalysis: match, isDemo: demo }));
  }, []);

  const setCareerAdvice = useCallback((advice: CareerAdvice, demo: boolean) => {
    setState((s) => ({ ...s, careerAdvice: advice, isDemo: demo }));
  }, []);

  const resetAll = useCallback(() => {
    setState(defaultState);
  }, []);

  return (
    <AppContext.Provider
      value={{ ...state, setCVText, setCVAnalysis, setJobDescription, setJobMatch, setCareerAdvice, resetAll }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
