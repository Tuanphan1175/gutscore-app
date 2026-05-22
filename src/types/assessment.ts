export interface AssessmentQuestion {
  id: string;
  page: number;
  question: string;
  options: { value: number; label: string }[];
}

export interface AssessmentAnswer {
  questionId: string;
  value: number;
}

export interface AssessmentResult {
  id: string;
  createdAt: string;
  gutHealthIndex: number;
  fiberScore: number;
  microbiomeScore: number;
  nutritionalRiskIndex: number;
  overallScore: number;
  aiAnalysis?: string;
  answers: AssessmentAnswer[];
}

export type AssessmentFormData = Record<string, number>;