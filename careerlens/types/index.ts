// ============================================================
// CareerLens — Central Type Definitions
// ============================================================

export interface CandidateProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  summary: string;
  education: Education[];
  experience: WorkExperience[];
  technicalSkills: string[];
  softSkills: string[];
  projects: Project[];
  certifications: string[];
  languages: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
  gpa: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
}

// ---- CV Analysis ----

export interface CVScoreBreakdown {
  structure: number;
  summary: number;
  skills: number;
  experience: number;
  achievements: number;
  education: number;
  keywords: number;
}

export interface CVImprovement {
  original: string;
  problem: string;
  recommendation: string;
  reason: string;
}

export interface CVAnalysis {
  overallScore: number;
  scoreBreakdown: CVScoreBreakdown;
  profile: CandidateProfile;
  strengths: string[];
  weaknesses: string[];
  missingInfo: string[];
  improvements: CVImprovement[];
}

// ---- Job Match ----

export interface SkillComparison {
  matched: string[];
  missing: string[];
  additional: string[];
}

export interface JobMatchAnalysis {
  overallMatch: number;
  skillCoverage: number;
  experienceMatch: number;
  educationMatch: number;
  keywordAlignment: number;
  skillComparison: SkillComparison;
  fitReasons: string[];
  gaps: string[];
  improvements: string[];
}

// ---- Career Advice ----

export interface CareerPath {
  title: string;
  reasoning: string;
  requiredSkills: string[];
  missingSkills: string[];
  growthPotential: string;
}

export interface LearningItem {
  skill: string;
  priority: "Tinggi" | "Sedang" | "Rendah";
  resource: string;
  project: string;
}

export interface LearningRoadmap {
  shortTerm: LearningItem[];   // 0–3 months
  midTerm: LearningItem[];     // 3–6 months
  longTerm: LearningItem[];    // 6–12 months
}

export interface CareerAdvice {
  careerPaths: CareerPath[];
  roadmap: LearningRoadmap;
  nextSteps: string[];
}

// ---- App-wide State ----

export interface AppState {
  cvText: string;
  fileName: string;
  cvAnalysis: CVAnalysis | null;
  jobDescription: string;
  jobMatchAnalysis: JobMatchAnalysis | null;
  careerAdvice: CareerAdvice | null;
  isDemo: boolean;
}
