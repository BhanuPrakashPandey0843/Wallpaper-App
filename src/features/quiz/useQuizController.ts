import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import {
  QUIZ_QUESTIONS,
  QUESTIONS_BANK_VERSION,
  type Difficulty,
  type QuizCategory,
  type QuizQuestion,
} from './questions';
import { selectQuizQuestions, questionsFromIds } from './selectQuestions';
import {
  loadQuizStats,
  saveQuizStats,
  loadPersistedSession,
  savePersistedSession,
  touchQuizCacheMeta,
  type PersistedQuizSession,
} from './storage';
import type { QuestionCount, QuizStats, QuizStep } from './types';
import { DEFAULT_TIMER_SECONDS, POINTS_PER_CORRECT } from './types';

export function useQuizController() {
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<QuizStep>('home');
  const [category, setCategory] = useState<QuizCategory>('mixed');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [useTimer, setUseTimer] = useState(true);
  const [questionCount, setQuestionCount] = useState<QuestionCount>(5);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [totalTimeSeconds, setTotalTimeSeconds] = useState(0);
  const [questionStartedAt, setQuestionStartedAt] = useState(() => Date.now());
  const [setupError, setSetupError] = useState<string | null>(null);
  const [stats, setStats] = useState<QuizStats>({
    playedCount: 0,
    bestScore: 0,
    totalAnswered: 0,
    totalCorrect: 0,
  });
  const [pendingResume, setPendingResume] = useState<PersistedQuizSession | null>(null);

  const timerResetToken = useRef(0);
  const finishingRef = useRef(false);

  const currentQuestion = useMemo(
    () => (questions.length ? questions[currentIndex] : undefined),
    [questions, currentIndex]
  );

  const accuracy = useMemo(
    () => (questions.length ? Math.round((correctCount / questions.length) * 100) : 0),
    [correctCount, questions.length]
  );

  const progressRatio = questions.length > 0 ? (currentIndex + 1) / questions.length : 0;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [loadedStats, session] = await Promise.all([loadQuizStats(), loadPersistedSession()]);
      if (cancelled) return;
      setStats(loadedStats);
      await touchQuizCacheMeta();
      if (session) setPendingResume(session);
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const buildSessionPayload = useCallback((): PersistedQuizSession | null => {
    if (step !== 'question' || questions.length === 0) return null;
    return {
      bankVersion: QUESTIONS_BANK_VERSION,
      questionIds: questions.map((q) => q.id),
      currentIndex,
      correctCount,
      selectedOption,
      revealed,
      timedOut,
      totalTimeSeconds,
      useTimer,
      timerSeconds: DEFAULT_TIMER_SECONDS,
    };
  }, [
    step,
    questions,
    currentIndex,
    correctCount,
    selectedOption,
    revealed,
    timedOut,
    totalTimeSeconds,
    useTimer,
  ]);

  useEffect(() => {
    if (!hydrated || step !== 'question' || questions.length === 0) return;
    const payload = buildSessionPayload();
    if (!payload) return;
    const t = setTimeout(() => {
      void savePersistedSession(payload);
    }, 280);
    return () => clearTimeout(t);
  }, [hydrated, step, questions.length, buildSessionPayload]);

  const clearSessionStorage = useCallback(() => {
    void savePersistedSession(null);
  }, []);

  const applyHydratedSession = useCallback((s: PersistedQuizSession) => {
    const qs = questionsFromIds(QUIZ_QUESTIONS, s.questionIds);
    if (qs.length !== s.questionIds.length) {
      void savePersistedSession(null);
      return false;
    }
    setQuestions(qs);
    setCurrentIndex(Math.min(s.currentIndex, qs.length - 1));
    setCorrectCount(s.correctCount);
    setSelectedOption(s.selectedOption);
    setRevealed(s.revealed);
    setTimedOut(s.timedOut);
    setTotalTimeSeconds(s.totalTimeSeconds);
    setUseTimer(s.useTimer);
    setQuestionStartedAt(Date.now());
    timerResetToken.current += 1;
    setStep('question');
    finishingRef.current = false;
    return true;
  }, []);

  const resetAndStartQuiz = useCallback(
    (selectedQuestions: QuizQuestion[], useTimerSetting: boolean) => {
      setSetupError(null);
      setPendingResume(null);
      void savePersistedSession(null);
      setQuestions(selectedQuestions);
      setCurrentIndex(0);
      setCorrectCount(0);
      setSelectedOption(null);
      setRevealed(false);
      setTimedOut(false);
      setTotalTimeSeconds(0);
      setQuestionStartedAt(Date.now());
      timerResetToken.current += 1;
      setStep('question');
      finishingRef.current = false;
      void savePersistedSession({
        bankVersion: QUESTIONS_BANK_VERSION,
        questionIds: selectedQuestions.map((q) => q.id),
        currentIndex: 0,
        correctCount: 0,
        selectedOption: null,
        revealed: false,
        timedOut: false,
        totalTimeSeconds: 0,
        useTimer: useTimerSetting,
        timerSeconds: DEFAULT_TIMER_SECONDS,
      });
    },
    []
  );

  const startQuiz = useCallback(() => {
    const selected = selectQuizQuestions(QUIZ_QUESTIONS, category, difficulty, questionCount);
    if (selected.length === 0) {
      setSetupError('No questions found for this category and difficulty.');
      return;
    }
    resetAndStartQuiz(selected, useTimer);
  }, [category, difficulty, questionCount, useTimer, resetAndStartQuiz]);

  const resumeQuiz = useCallback(() => {
    if (!pendingResume) return;
    const ok = applyHydratedSession(pendingResume);
    if (ok) setPendingResume(null);
    else setPendingResume(null);
  }, [pendingResume, applyHydratedSession]);

  const dismissResume = useCallback(() => {
    void savePersistedSession(null);
    setPendingResume(null);
  }, []);

  const pickAnswer = useCallback(
    (index: number) => {
      if (!currentQuestion || revealed) return;
      setRevealed(true);
      setTimedOut(false);
      setSelectedOption(index);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (index === currentQuestion.correctIndex) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setCorrectCount((c) => c + 1);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      const elapsedSec = Math.max(0, Math.round((Date.now() - questionStartedAt) / 1000));
      setTotalTimeSeconds((t) => t + elapsedSec);
    },
    [currentQuestion, revealed, questionStartedAt]
  );

  const onTimerExpire = useCallback(() => {
    if (!currentQuestion || revealed) return;
    setRevealed(true);
    setTimedOut(true);
    setSelectedOption(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    const elapsedSec = Math.max(0, Math.round((Date.now() - questionStartedAt) / 1000));
    setTotalTimeSeconds((t) => t + elapsedSec);
  }, [currentQuestion, revealed, questionStartedAt]);

  const goNext = useCallback(() => {
    if (!questions.length) return;
    const next = currentIndex + 1;
    if (next < questions.length) {
      setCurrentIndex(next);
      setSelectedOption(null);
      setRevealed(false);
      setTimedOut(false);
      setQuestionStartedAt(Date.now());
      timerResetToken.current += 1;
      return;
    }
    if (finishingRef.current) return;
    finishingRef.current = true;
    setStep('result');
    setStats((prev) => {
      const playedCount = prev.playedCount + 1;
      const bestScore = Math.max(prev.bestScore, correctCount);
      const totalAnswered = prev.totalAnswered + questions.length;
      const totalCorrect = prev.totalCorrect + correctCount;
      const nextStats = { playedCount, bestScore, totalAnswered, totalCorrect };
      void saveQuizStats(nextStats);
      return nextStats;
    });
    void savePersistedSession(null);
  }, [questions.length, currentIndex, correctCount]);

  const retryQuiz = useCallback(() => {
    finishingRef.current = false;
    setStep('home');
    setCurrentIndex(0);
    setCorrectCount(0);
    setSelectedOption(null);
    setRevealed(false);
    setTimedOut(false);
    setQuestions([]);
  }, []);

  const openLeaderboard = useCallback(() => setStep('leaderboard'), []);
  const openSetup = useCallback(() => setStep('setup'), []);
  const backToHomeFromLeaderboard = useCallback(() => setStep('home'), []);

  const startDailyChallenge = useCallback(() => {
    setCategory('mixed');
    setDifficulty('medium');
    setQuestionCount(5);
    setUseTimer(true);
    const selected = selectQuizQuestions(QUIZ_QUESTIONS, 'mixed', 'medium', 5);
    if (selected.length === 0) {
      setSetupError('Daily challenge is temporarily unavailable.');
      return;
    }
    resetAndStartQuiz(selected, true);
  }, []);

  const badge =
    accuracy >= 90 ? 'Apostle' : accuracy >= 75 ? 'Evangelist' : accuracy >= 50 ? 'Disciple' : 'Beginner';

  const lastAnswerCorrect =
    revealed && !timedOut && selectedOption !== null && currentQuestion
      ? selectedOption === currentQuestion.correctIndex
      : false;

  const pointsThisQuestion = lastAnswerCorrect ? POINTS_PER_CORRECT : 0;

  return {
    hydrated,
    step,
    category,
    setCategory,
    difficulty,
    setDifficulty,
    useTimer,
    setUseTimer,
    questionCount,
    setQuestionCount,
    questions,
    currentIndex,
    currentQuestion,
    correctCount,
    selectedOption,
    revealed,
    timedOut,
    totalTimeSeconds,
    setupError,
    stats,
    pendingResume,
    accuracy,
    progressRatio,
    badge,
    lastAnswerCorrect,
    pointsThisQuestion,
    timerResetToken: timerResetToken.current,
    questionStartedAt,
    startQuiz,
    resumeQuiz,
    dismissResume,
    pickAnswer,
    onTimerExpire,
    goNext,
    retryQuiz,
    openLeaderboard,
    openSetup,
    backToHomeFromLeaderboard,
    startDailyChallenge,
    clearSessionStorage,
    POINTS_PER_CORRECT,
  };
}
