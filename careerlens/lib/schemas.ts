import { z } from "zod";

// ============================================================
// Zod validation schemas for AI response payloads
// ============================================================

const EducationSchema = z.object({
  institution: z.string().default(""),
  degree: z.string().default(""),
  field: z.string().default(""),
  graduationYear: z.string().default(""),
  gpa: z.string().default(""),
});

const WorkExperienceSchema = z.object({
  company: z.string().default(""),
  position: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  description: z.array(z.string()).default([]),
});

const ProjectSchema = z.object({
  name: z.string().default(""),
  description: z.string().default(""),
  technologies: z.array(z.string()).default([]),
});

const CandidateProfileSchema = z.object({
  fullName: z.string().default(""),
  email: z.string().default(""),
  phone: z.string().default(""),
  location: z.string().default(""),
  linkedIn: z.string().default(""),
  summary: z.string().default(""),
  education: z.array(EducationSchema).default([]),
  experience: z.array(WorkExperienceSchema).default([]),
  technicalSkills: z.array(z.string()).default([]),
  softSkills: z.array(z.string()).default([]),
  projects: z.array(ProjectSchema).default([]),
  certifications: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
});

const CVImprovementSchema = z.object({
  original: z.string().default(""),
  problem: z.string().default(""),
  recommendation: z.string().default(""),
  reason: z.string().default(""),
});

export const CVAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  scoreBreakdown: z.object({
    structure: z.number().min(0).max(100),
    summary: z.number().min(0).max(100),
    skills: z.number().min(0).max(100),
    experience: z.number().min(0).max(100),
    achievements: z.number().min(0).max(100),
    education: z.number().min(0).max(100),
    keywords: z.number().min(0).max(100),
  }),
  profile: CandidateProfileSchema,
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  missingInfo: z.array(z.string()).default([]),
  improvements: z.array(CVImprovementSchema).default([]),
});

const SkillComparisonSchema = z.object({
  matched: z.array(z.string()).default([]),
  missing: z.array(z.string()).default([]),
  additional: z.array(z.string()).default([]),
});

export const JobMatchSchema = z.object({
  overallMatch: z.number().min(0).max(100),
  skillCoverage: z.number().min(0).max(100),
  experienceMatch: z.number().min(0).max(100),
  educationMatch: z.number().min(0).max(100),
  keywordAlignment: z.number().min(0).max(100),
  skillComparison: SkillComparisonSchema,
  fitReasons: z.array(z.string()).default([]),
  gaps: z.array(z.string()).default([]),
  improvements: z.array(z.string()).default([]),
});

const LearningItemSchema = z.object({
  skill: z.string().default(""),
  priority: z.enum(["Tinggi", "Sedang", "Rendah"]).default("Sedang"),
  resource: z.string().default(""),
  project: z.string().default(""),
});

const CareerPathSchema = z.object({
  title: z.string().default(""),
  reasoning: z.string().default(""),
  requiredSkills: z.array(z.string()).default([]),
  missingSkills: z.array(z.string()).default([]),
  growthPotential: z.string().default(""),
});

export const CareerAdviceSchema = z.object({
  careerPaths: z.array(CareerPathSchema).min(1).max(3),
  roadmap: z.object({
    shortTerm: z.array(LearningItemSchema).default([]),
    midTerm: z.array(LearningItemSchema).default([]),
    longTerm: z.array(LearningItemSchema).default([]),
  }),
  nextSteps: z.array(z.string()).default([]),
});
