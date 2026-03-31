import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { shadows } from '../../src/theme/shadows';
import Text from '../../src/components/ui/Text';
import Button from '../../src/components/ui/Button';
import Card from '../../src/components/ui/Card';
import * as Haptics from 'expo-haptics';
import { Difficulty, QUIZ_QUESTIONS, QuizCategory, QuizQuestion } from '../../src/features/quiz/questions';

type QuizStep = 'home' | 'setup' | 'question' | 'result' | 'leaderboard';
type QuestionCount = 5 | 10 | 15;
type LeaderboardFilter = 'global' | 'weekly' | 'friends';

const LEADERBOARD_ROWS = [
  { id: 'u1', username: 'GraceSoul', score: 96, rank: 1 },
  { id: 'u2', username: 'FaithWalker', score: 91, rank: 2 },
  { id: 'u3', username: 'HopeLight', score: 88, rank: 3 },
  { id: 'me', username: 'You', score: 82, rank: 8 },
];

export default function QuizScreen() {
  const [step, setStep] = useState<QuizStep>('home');
  const [category, setCategory] = useState<QuizCategory>('mixed');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [useTimer, setUseTimer] = useState<boolean>(true);
  const [questionCount, setQuestionCount] = useState<QuestionCount>(5);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [bestScore, setBestScore] = useState(0);
  const [playedCount, setPlayedCount] = useState(0);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);
  const [questionStartAt, setQuestionStartAt] = useState<number>(0);
  const [leaderboardFilter, setLeaderboardFilter] = useState<LeaderboardFilter>('global');

  const currentQuestion = useMemo(() => questions[currentIndex], [questions, currentIndex]);

  const accuracy = useMemo(
    () => (questions.length ? Math.round((correctCount / questions.length) * 100) : 0),
    [correctCount, questions.length]
  );

  const onStartSetup = () => setStep('setup');

  const onStartQuiz = () => {
    const filtered = QUIZ_QUESTIONS.filter((item) => {
      const categoryMatch = category === 'mixed' ? true : item.category === category;
      return categoryMatch && item.difficulty === difficulty;
    });
    const desired = Math.max(1, questionCount);
    const selected = filtered.slice(0, desired);
    if (selected.length === 0) {
      setSetupError('No questions found for this category and difficulty.');
      return;
    }
    setSetupError(null);
    setQuestions(selected);
    setStep('question');
    setCurrentIndex(0);
    setCorrectCount(0);
    setSelectedOption(null);
    setTimeLeft(20);
    setTotalTimeTaken(0);
    setQuestionStartAt(Date.now());
  };

  const onAnswer = (index: number) => {
    if (!currentQuestion || selectedOption !== null) return;
    setSelectedOption(index);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (index === currentQuestion.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
    const elapsedMs = Math.max(0, Date.now() - questionStartAt);
    setTotalTimeTaken((prev) => prev + Math.round(elapsedMs / 1000));

    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < questions.length) {
        setCurrentIndex(nextIndex);
        setSelectedOption(null);
        setTimeLeft(20);
        setQuestionStartAt(Date.now());
      } else {
        setStep('result');
      }
    }, 800);
  };

  const onRetry = () => {
    setStep('home');
    setCurrentIndex(0);
    setCorrectCount(0);
    setSelectedOption(null);
  };

  const onOpenLeaderboard = () => {
    setStep('leaderboard');
  };

  const onBackFromLeaderboard = () => {
    setStep('home');
  };

  const onShareScore = async () => {
    await Share.share({
      message: `I scored ${correctCount}/${questions.length} in Faith Frames Quiz and earned ${badge} badge.`,
    });
  };

  useEffect(() => {
    if (step !== 'question' || !useTimer || selectedOption !== null) return;
    const id = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          clearInterval(id);
          onAnswer(-1);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [step, useTimer, currentIndex, selectedOption]);

  useEffect(() => {
    if (step === 'result') {
      setPlayedCount((count) => count + 1);
      setBestScore((previous) => Math.max(previous, correctCount));
    }
  }, [step, correctCount]);

  const badge =
    accuracy >= 90 ? 'Apostle' : accuracy >= 75 ? 'Evangelist' : accuracy >= 50 ? 'Disciple' : 'Beginner';
  const progressPct = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  if (step === 'home') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text variant="sm" color="textSecondary">
            Verse of the Day
          </Text>
          <Card elevated style={styles.verseCard}>
            <Text variant="lg" bold>
              “Your word is a lamp to my feet and a light to my path.”
            </Text>
            <Text variant="sm" color="textSecondary" style={styles.verseRef}>
              Psalm 119:105
            </Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text variant="sm" color="textSecondary">
            Ready to grow?
          </Text>
          <Card elevated style={styles.primaryCard}>
            <Text variant="lg" bold>
              Faith Quiz
            </Text>
            <Text variant="sm" color="textSecondary" style={styles.mtXs}>
              Test your Bible knowledge with peaceful, meaningful questions.
            </Text>
            <Button title="Start Quiz" onPress={onStartSetup} style={styles.primaryButton} />
            <Button variant="surface" title="Daily Challenge" onPress={() => {
              setCategory('mixed');
              setDifficulty('medium');
              setQuestionCount(5);
              setUseTimer(true);
              onStartQuiz();
            }} style={styles.mtSm} />
          </Card>
        </View>

        <View style={styles.section}>
          <Text variant="sm" color="textSecondary">
            Your Stats
          </Text>
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Text variant="xs" color="textSecondary">
                Quizzes Played
              </Text>
              <Text variant="lg" bold>
                {playedCount}
              </Text>
            </Card>
            <Card style={styles.statCard}>
              <Text variant="xs" color="textSecondary">
                Accuracy
              </Text>
              <Text variant="lg" bold>
                {playedCount > 0 ? `${accuracy}%` : '0%'}
              </Text>
            </Card>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="sm" color="textSecondary">
            Leaderboard
          </Text>
          <Card style={styles.leaderboardCard}>
            <Text variant="xs" color="textSecondary">
              Coming soon
            </Text>
            <Button variant="surface" title="View Leaderboard" onPress={onOpenLeaderboard} style={styles.mtSm} />
          </Card>
        </View>

        <View style={styles.section}>
          <Card style={styles.leaderboardCard}>
            <Text variant="xs" color="textSecondary">
              Best Score
            </Text>
            <Text variant="lg" bold>
              {bestScore}
            </Text>
          </Card>
        </View>
      </ScrollView>
    );
  }

  if (step === 'setup') {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text variant="lg" bold>
            Quiz Setup
          </Text>

          <View style={styles.section}>
            <Text variant="sm" color="textSecondary">
              Category
            </Text>
            <View style={styles.chipRow}>
              {[
                { id: 'bible', label: 'Bible' },
                { id: 'jesus', label: 'Jesus Life' },
                { id: 'old', label: 'Old Testament' },
                { id: 'new', label: 'New Testament' },
                { id: 'mixed', label: 'Mixed' },
              ].map((cat) => {
                const isActive = category === (cat.id as QuizCategory);
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setCategory(cat.id as QuizCategory)}
                    style={[
                      styles.chip,
                      isActive && { backgroundColor: colors.accent, borderColor: 'transparent' },
                    ]}
                  >
                    <Text variant="xs" color={isActive ? 'textPrimary' : 'textSecondary'}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text variant="sm" color="textSecondary">
              Difficulty
            </Text>
            <View style={styles.chipRow}>
              {[
                { id: 'easy', label: 'Easy' },
                { id: 'medium', label: 'Medium' },
                { id: 'hard', label: 'Hard' },
              ].map((diff) => {
                const isActive = difficulty === (diff.id as Difficulty);
                return (
                  <TouchableOpacity
                    key={diff.id}
                    onPress={() => setDifficulty(diff.id as Difficulty)}
                    style={[
                      styles.chip,
                      isActive && { backgroundColor: colors.accent, borderColor: 'transparent' },
                    ]}
                  >
                    <Text variant="xs" color={isActive ? 'textPrimary' : 'textSecondary'}>
                      {diff.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text variant="sm" color="textSecondary">
              Number of Questions
            </Text>
            <View style={styles.chipRow}>
              {[5, 10, 15].map((count) => {
                const active = questionCount === count;
                return (
                  <TouchableOpacity
                    key={count}
                    onPress={() => setQuestionCount(count as QuestionCount)}
                    style={[styles.chip, active && { backgroundColor: colors.accent, borderColor: 'transparent' }]}
                  >
                    <Text variant="xs" color={active ? 'textPrimary' : 'textSecondary'}>
                      {count}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text variant="sm" color="textSecondary">
              Timer
            </Text>
            <TouchableOpacity onPress={() => setUseTimer((value) => !value)}>
              <Card style={styles.toggleCard}>
              <Text variant="sm" bold>
                {useTimer ? 'Timer On' : 'Timer Off'}
              </Text>
              </Card>
            </TouchableOpacity>
            {!!setupError && (
              <Text variant="xs" color="accent" style={styles.mtSm}>
                {setupError}
              </Text>
            )}
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <Button title="Start Quiz" onPress={onStartQuiz} />
        </View>
      </View>
    );
  }

  if (step === 'question') {
    if (!currentQuestion) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text variant="md" bold>
              Could not load quiz questions.
            </Text>
          </View>
          <View style={styles.bottomBar}>
            <Button variant="surface" title="Back to Quiz Home" onPress={onBackFromLeaderboard} />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.questionHeader}>
          <Text variant="xs" color="textSecondary">
            Question {currentIndex + 1} / {questions.length}
          </Text>
          {useTimer && (
            <Text variant="xs" color="warning">
              {timeLeft}s
            </Text>
          )}
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>

        <View style={styles.questionBody}>
          <Text variant="lg" bold>
            {currentQuestion.question}
          </Text>
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQuestion.correctIndex;
              const bg =
                selectedOption === null
                  ? colors.surface
                  : isCorrect
                  ? '#1B5E20'
                  : isSelected
                  ? '#7F1D1D'
                  : colors.surface;

              return (
                <Card
                  key={opt}
                  elevated
                  style={[styles.optionCard, { backgroundColor: bg }]}
                >
                  <TouchableOpacity onPress={() => onAnswer(idx)} style={styles.optionPressArea}>
                    <Text variant="sm">{opt}</Text>
                  </TouchableOpacity>
                </Card>
              );
            })}
          </View>
        </View>

        <View style={styles.explanation}>
          <Text variant="xs" color="textSecondary">
            Reference: {currentQuestion.reference}
          </Text>
          <Text variant="xs" color="textSecondary" style={styles.mtXs}>
            {currentQuestion.explanation}
          </Text>
        </View>
      </View>
    );
  }

  if (step === 'leaderboard') {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text variant="lg" bold>
            Leaderboard
          </Text>
          <View style={styles.chipRow}>
            {[
              { id: 'global', label: 'Global' },
              { id: 'weekly', label: 'Weekly' },
              { id: 'friends', label: 'Friends' },
            ].map((item) => {
              const active = leaderboardFilter === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setLeaderboardFilter(item.id as LeaderboardFilter)}
                  style={[styles.chip, active && { backgroundColor: colors.accent, borderColor: 'transparent' }]}
                >
                  <Text variant="xs" color={active ? 'textPrimary' : 'textSecondary'}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Card style={styles.leaderboardCard}>
            {LEADERBOARD_ROWS.map((row) => (
              <View
                key={row.id}
                style={[styles.leaderboardRow, row.id === 'me' && styles.leaderboardRowCurrent]}
              >
                <Text variant="sm" bold>{row.rank}</Text>
                <Text variant="sm" style={styles.flexText}>{row.username}</Text>
                <Text variant="sm" color="warning">{row.score}</Text>
              </View>
            ))}
          </Card>
        </View>
        <View style={styles.bottomBar}>
          <Button variant="surface" title="Back to Quiz Home" onPress={onBackFromLeaderboard} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="lg" bold>
          Quiz Result
        </Text>
        <Card style={styles.resultCard}>
          <Text variant="sm" color="textSecondary">
            Score
          </Text>
          <Text variant="lg" bold>
            {correctCount} / {questions.length}
          </Text>
          <Text variant="sm" color="textSecondary" style={styles.mtSm}>
            Accuracy: {accuracy}%
          </Text>
          <Text variant="sm" color="textSecondary" style={styles.mtSm}>
            Time Taken: {totalTimeTaken}s
          </Text>
          <Text variant="sm" color="warning" style={styles.mtSm}>
            Badge: {badge}
          </Text>
          <Text variant="xs" color="textSecondary" style={styles.mtSm}>
            {accuracy >= 75
              ? 'Great work. Keep seeking wisdom in His word.'
              : 'Stay encouraged. Every quiz helps you grow in faith.'}
          </Text>
        </Card>
      </View>
      <View style={styles.bottomBar}>
        <Button title="Retry Quiz" onPress={onRetry} style={styles.flexButton} />
        <Button variant="surface" title="Share Score" onPress={onShareScore} style={styles.flexButton} />
        <Button variant="surface" title="View Leaderboard" onPress={onOpenLeaderboard} style={styles.flexButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  verseCard: {
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  verseRef: {
    marginTop: spacing.sm,
  },
  primaryCard: {
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceElevated,
    ...shadows.md,
  },
  primaryButton: {
    marginTop: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  leaderboardCard: {
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderTranslucent,
  },
  toggleCard: {
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  bottomBar: {
    padding: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderTranslucent,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    gap: spacing.md,
  },
  questionHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTrack: {
    height: 6,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceElevated,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
  },
  questionBody: {
    flex: 1,
    padding: spacing.lg,
  },
  optionsContainer: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  optionCard: {
    borderRadius: radius.md,
  },
  optionPressArea: {
    padding: spacing.md,
  },
  explanation: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  resultCard: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceElevated,
  },
  mtXs: {
    marginTop: spacing.xs,
  },
  mtSm: {
    marginTop: spacing.sm,
  },
  flexButton: {
    flex: 1,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderTranslucent,
  },
  leaderboardRowCurrent: {
    backgroundColor: colors.glass,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
  },
  flexText: {
    flex: 1,
    marginLeft: spacing.sm,
  },
});