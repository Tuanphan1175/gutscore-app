import { AssessmentAnswer, AssessmentResult } from '@/types/assessment';
import { ASSESSMENT_QUESTIONS } from '@/constants/questions';

interface ScoreCalculation {
  gutHealthIndex: number;
  fiberScore: number;
  microbiomeScore: number;
  nutritionalRiskIndex: number;
  overallScore: number;
}

function calculateSubScore(answers: AssessmentAnswer[], page: number): number {
  const pageQuestions = ASSESSMENT_QUESTIONS.filter(q => q.page === page);
  let totalScore = 0;
  let maxScore = 0;

  for (const q of pageQuestions) {
    const answer = answers.find(a => a.questionId === q.id);
    if (answer) {
      totalScore += answer.value;
      maxScore += Math.max(...q.options.map(o => o.value));
    }
  }

  return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
}

export function calculateScores(answers: AssessmentAnswer[]): ScoreCalculation {
  const gutHealthIndex = calculateSubScore(answers, 1);
  const fiberScore = calculateSubScore(answers, 2);
  const microbiomeScore = calculateSubScore(answers, 3);
  const nutritionalRiskIndex = calculateSubScore(answers, 4);

  // Overall score is weighted average
  const overallScore = Math.round(
    gutHealthIndex * 0.35 +
    fiberScore * 0.25 +
    microbiomeScore * 0.20 +
    nutritionalRiskIndex * 0.20
  );

  return {
    gutHealthIndex,
    fiberScore,
    microbiomeScore,
    nutritionalRiskIndex,
    overallScore,
  };
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Xuất sắc';
  if (score >= 60) return 'Tốt';
  if (score >= 40) return 'Trung bình';
  if (score >= 20) return 'Yếu';
  return 'Cần cải thiện';
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#34C759';
  if (score >= 60) return '#208AEF';
  if (score >= 40) return '#FF9500';
  return '#FF3B30';
}