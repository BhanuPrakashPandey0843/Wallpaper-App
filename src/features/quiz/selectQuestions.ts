import type { Difficulty, QuizCategory, QuizQuestion } from './questions';

function shuffleInPlace<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function filterQuestionPool(
  bank: QuizQuestion[],
  category: QuizCategory,
  difficulty: Difficulty
): QuizQuestion[] {
  return bank.filter((q) => {
    const categoryMatch = category === 'mixed' ? true : q.category === category;
    return categoryMatch && q.difficulty === difficulty;
  });
}

/** Stable, scalable selection: shuffle pool then take N (avoids always same first questions). */
export function selectQuizQuestions(
  bank: QuizQuestion[],
  category: QuizCategory,
  difficulty: Difficulty,
  count: number
): QuizQuestion[] {
  const pool = filterQuestionPool(bank, category, difficulty);
  if (pool.length === 0) return [];
  const shuffled = shuffleInPlace(pool);
  const n = Math.min(Math.max(1, count), shuffled.length);
  return shuffled.slice(0, n);
}

export function questionsFromIds(bank: QuizQuestion[], ids: string[]): QuizQuestion[] {
  const map = new Map(bank.map((q) => [q.id, q]));
  return ids.map((id) => map.get(id)).filter((q): q is QuizQuestion => q != null);
}
