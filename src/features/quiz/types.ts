import type { QuizCategory, QuizQuestion } from './questions';

export type QuizStep = 'home' | 'setup' | 'question' | 'result' | 'leaderboard';

export type QuestionCount = 5 | 10 | 15;

export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly';

export interface LeaderboardEntry {
  id: string;
  rank: number;
  displayName: string;
  score: number;
  subtitle: string;
  isCurrentUser?: boolean;
}

export interface QuizStats {
  playedCount: number;
  bestScore: number;
  totalAnswered: number;
  totalCorrect: number;
}

export interface ActiveQuizState {
  questions: QuizQuestion[];
  currentIndex: number;
  correctCount: number;
  /** User selection for current question; null if timed out before picking */
  selectedOption: number | null;
  revealed: boolean;
  timedOut: boolean;
  totalTimeSeconds: number;
  questionStartedAt: number;
  category: QuizCategory;
  useTimer: boolean;
  timerSeconds: number;
}

export const DEFAULT_TIMER_SECONDS = 20;
export const POINTS_PER_CORRECT = 10;
