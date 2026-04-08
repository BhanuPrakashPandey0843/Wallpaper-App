import AsyncStorage from '@react-native-async-storage/async-storage';
import { QUESTIONS_BANK_VERSION } from './questions';
import type { QuizStats } from './types';

const KEY_STATS = '@ff_quiz_stats_v1';
const KEY_SESSION = '@ff_quiz_session_v2';
const KEY_CACHE_META = '@ff_quiz_cache_meta_v1';

export interface PersistedQuizSession {
  bankVersion: number;
  questionIds: string[];
  currentIndex: number;
  correctCount: number;
  selectedOption: number | null;
  revealed: boolean;
  timedOut: boolean;
  totalTimeSeconds: number;
  useTimer: boolean;
  timerSeconds: number;
}

export const defaultStats: QuizStats = {
  playedCount: 0,
  bestScore: 0,
  totalAnswered: 0,
  totalCorrect: 0,
};

export async function loadQuizStats(): Promise<QuizStats> {
  try {
    const raw = await AsyncStorage.getItem(KEY_STATS);
    if (!raw) return { ...defaultStats };
    const parsed = JSON.parse(raw) as QuizStats;
    return {
      playedCount: Number(parsed.playedCount) || 0,
      bestScore: Number(parsed.bestScore) || 0,
      totalAnswered: Number(parsed.totalAnswered) || 0,
      totalCorrect: Number(parsed.totalCorrect) || 0,
    };
  } catch {
    return { ...defaultStats };
  }
}

export async function saveQuizStats(stats: QuizStats): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY_STATS, JSON.stringify(stats));
  } catch {
    /* ignore */
  }
}

export async function loadPersistedSession(): Promise<PersistedQuizSession | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY_SESSION);
    if (!raw) return null;
    const s = JSON.parse(raw) as PersistedQuizSession;
    if (!Array.isArray(s.questionIds) || s.questionIds.length === 0) return null;
    if (s.bankVersion !== QUESTIONS_BANK_VERSION) return null;
    return s;
  } catch {
    return null;
  }
}

export async function savePersistedSession(session: PersistedQuizSession | null): Promise<void> {
  try {
    if (session == null) {
      await AsyncStorage.removeItem(KEY_SESSION);
      return;
    }
    await AsyncStorage.setItem(KEY_SESSION, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}

/** Lightweight “cache” marker for offline-first static bank sync semantics */
export async function touchQuizCacheMeta(): Promise<void> {
  try {
    await AsyncStorage.setItem(
      KEY_CACHE_META,
      JSON.stringify({ bankVersion: QUESTIONS_BANK_VERSION, updatedAt: Date.now() })
    );
  } catch {
    /* ignore */
  }
}

export async function readQuizCacheMeta(): Promise<{ bankVersion: number; updatedAt: number } | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY_CACHE_META);
    if (!raw) return null;
    return JSON.parse(raw) as { bankVersion: number; updatedAt: number };
  } catch {
    return null;
  }
}
