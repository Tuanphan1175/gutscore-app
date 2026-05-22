import { create } from 'zustand';
import { AssessmentAnswer, AssessmentResult } from '@/types/assessment';

interface AssessmentState {
  currentPage: number;
  answers: AssessmentAnswer[];
  result: AssessmentResult | null;
  isLoading: boolean;
  error: string | null;

  setPage: (page: number) => void;
  setAnswer: (questionId: string, value: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  submitAssessment: () => AssessmentResult;
  setAiAnalysis: (analysis: string) => void;
  clearAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  currentPage: 1,
  answers: [],
  result: null,
  isLoading: false,
  error: null,

  setPage: (page) => set({ currentPage: page }),

  setAnswer: (questionId, value) => {
    const { answers } = get();
    const existing = answers.findIndex(a => a.questionId === questionId);
    if (existing >= 0) {
      const newAnswers = [...answers];
      newAnswers[existing] = { questionId, value };
      set({ answers: newAnswers });
    } else {
      set({ answers: [...answers, { questionId, value }] });
    }
  },

  nextPage: () => set(state => ({ currentPage: Math.min(state.currentPage + 1, 4) })),
  prevPage: () => set(state => ({ currentPage: Math.max(state.currentPage - 1, 1) })),

  submitAssessment: () => {
    const { answers } = get();
    // Import dynamically to avoid circular deps
    const { calculateScores } = require('@/lib/scoring');
    const scores = calculateScores(answers);

    const result: AssessmentResult = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...scores,
      answers: [...answers],
    };

    set({ result });
    return result;
  },

  setAiAnalysis: (aiAnalysis: string) => {
    const { result } = get();
    if (result) {
      set({ result: { ...result, aiAnalysis } });
    }
  },

  clearAssessment: () => set({
    currentPage: 1,
    answers: [],
    result: null,
    error: null,
  }),
}));