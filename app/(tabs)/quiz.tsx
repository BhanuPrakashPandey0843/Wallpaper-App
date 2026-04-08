import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { shadows } from '../../src/theme/shadows';
import Text from '../../src/components/ui/Text';
import Button from '../../src/components/ui/Button';
import Card from '../../src/components/ui/Card';
import { Difficulty, QuizCategory } from '../../src/features/quiz/questions';
import { useQuizController } from '../../src/features/quiz/useQuizController';
import { quizTheme } from '../../src/features/quiz/theme';
import { QuizLeaderboardView } from '../../src/features/quiz/components/QuizLeaderboardView';
import { QuizQuestionView } from '../../src/features/quiz/components/QuizQuestionView';
import { QuizHomeSkeleton } from '../../src/features/quiz/components/QuizHomeSkeleton';
import type { QuestionCount } from '../../src/features/quiz/types';
import { useFloatingTabBarPadding } from '../../src/components/navigation/floatingTabBarPadding';

export default function QuizScreen() {
  const q = useQuizController();
  const tabBarPad = useFloatingTabBarPadding();

  const lifetimeAccuracy = useMemo(
    () =>
      q.stats.totalAnswered > 0
        ? Math.round((q.stats.totalCorrect / q.stats.totalAnswered) * 100)
        : 0,
    [q.stats.totalAnswered, q.stats.totalCorrect]
  );

  const onShareScore = async () => {
    await Share.share({
      message: `I scored ${q.correctCount}/${q.questions.length} in Faith Frames Quiz and earned ${q.badge} badge.`,
    });
  };

  if (!q.hydrated) {
    return (
      <View style={[styles.container, { backgroundColor: quizTheme.bgDeep, paddingBottom: tabBarPad }]}>
        <QuizHomeSkeleton />
      </View>
    );
  }

  if (q.step === 'leaderboard') {
    return <QuizLeaderboardView onBack={q.backToHomeFromLeaderboard} />;
  }

  if (q.step === 'question' && q.currentQuestion) {
    return (
      <QuizQuestionView
        question={q.currentQuestion}
        questionIndex={q.currentIndex}
        totalQuestions={q.questions.length}
        useTimer={q.useTimer}
        revealed={q.revealed}
        timedOut={q.timedOut}
        selectedOption={q.selectedOption}
        lastAnswerCorrect={q.lastAnswerCorrect}
        pointsThisQuestion={q.pointsThisQuestion}
        progressRatio={q.progressRatio}
        timerResetToken={q.timerResetToken}
        onPick={q.pickAnswer}
        onNext={q.goNext}
        onTimerExpire={q.onTimerExpire}
      />
    );
  }

  if (q.step === 'question' && !q.currentQuestion) {
    return (
      <View style={[styles.container, { backgroundColor: quizTheme.bgDeep }]}>
        <View style={styles.content}>
          <Text variant="md" bold>
            Could not load quiz questions.
          </Text>
          <Text variant="sm" color="textSecondary" style={styles.mtSm}>
            Try a different category or check back later.
          </Text>
        </View>
        <View style={[styles.bottomBar, { paddingBottom: spacing.lg + tabBarPad }]}>
          <Button variant="surface" title="Back to Quiz Home" onPress={q.retryQuiz} />
        </View>
      </View>
    );
  }

  if (q.step === 'home') {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={[styles.content, { paddingBottom: spacing.xl + tabBarPad }]}
        showsVerticalScrollIndicator={false}
      >
        {q.pendingResume ? (
          <Card style={[styles.resumeCard, { borderColor: quizTheme.lime, borderWidth: 1 }]}>
            <Text variant="sm" bold>
              Resume your quiz?
            </Text>
            <Text variant="xs" color="textSecondary" style={styles.mtXs}>
              You have a saved session in progress.
            </Text>
            <View style={styles.resumeRow}>
              <Button title="Continue" onPress={q.resumeQuiz} style={styles.flexButton} />
              <Button variant="surface" title="Dismiss" onPress={q.dismissResume} style={styles.flexButton} />
            </View>
          </Card>
        ) : null}

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
            <Button title="Start Quiz" onPress={q.openSetup} style={styles.primaryButton} />
            <Button
              variant="surface"
              title="Daily Challenge"
              onPress={q.startDailyChallenge}
              style={styles.mtSm}
            />
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
                {q.stats.playedCount}
              </Text>
            </Card>
            <Card style={styles.statCard}>
              <Text variant="xs" color="textSecondary">
                Lifetime accuracy
              </Text>
              <Text variant="lg" bold>
                {q.stats.playedCount > 0 ? `${lifetimeAccuracy}%` : '—'}
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
              See how you rank today.
            </Text>
            <Button variant="surface" title="View Leaderboard" onPress={q.openLeaderboard} style={styles.mtSm} />
          </Card>
        </View>

        <View style={styles.section}>
          <Card style={styles.leaderboardCard}>
            <Text variant="xs" color="textSecondary">
              Best Score (last round)
            </Text>
            <Text variant="lg" bold>
              {q.stats.bestScore}
            </Text>
          </Card>
        </View>
      </ScrollView>
    );
  }

  if (q.step === 'setup') {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: spacing.lg + tabBarPad }]}
          showsVerticalScrollIndicator={false}
        >
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
                const isActive = q.category === (cat.id as QuizCategory);
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => q.setCategory(cat.id as QuizCategory)}
                    style={[styles.chip, isActive && { backgroundColor: colors.accent, borderColor: 'transparent' }]}
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
                const isActive = q.difficulty === (diff.id as Difficulty);
                return (
                  <TouchableOpacity
                    key={diff.id}
                    onPress={() => q.setDifficulty(diff.id as Difficulty)}
                    style={[styles.chip, isActive && { backgroundColor: colors.accent, borderColor: 'transparent' }]}
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
              {([5, 10, 15] as const).map((count) => {
                const active = q.questionCount === count;
                return (
                  <TouchableOpacity
                    key={count}
                    onPress={() => q.setQuestionCount(count as QuestionCount)}
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
            <TouchableOpacity onPress={() => q.setUseTimer((value) => !value)}>
              <Card style={styles.toggleCard}>
                <Text variant="sm" bold>
                  {q.useTimer ? 'Timer On' : 'Timer Off'}
                </Text>
              </Card>
            </TouchableOpacity>
            {!!q.setupError && (
              <Text variant="xs" color="accent" style={styles.mtSm}>
                {q.setupError}
              </Text>
            )}
          </View>
        </ScrollView>

        <View style={[styles.bottomBar, { paddingBottom: spacing.lg + tabBarPad }]}>
          <Button title="Start Quiz" onPress={q.startQuiz} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: quizTheme.bgDeep }]}>
      <View style={[styles.content, { flex: 1 }]}>
        <Text variant="lg" bold style={{ color: '#FFF' }}>
          Quiz Result
        </Text>
        <Card style={styles.resultCard}>
          <Text variant="sm" color="textSecondary">
            Score
          </Text>
          <Text variant="lg" bold>
            {q.correctCount} / {q.questions.length}
          </Text>
          <Text variant="sm" color="textSecondary" style={styles.mtSm}>
            Accuracy: {q.accuracy}%
          </Text>
          <Text variant="sm" color="textSecondary" style={styles.mtSm}>
            Time Taken: {q.totalTimeSeconds}s
          </Text>
          <Text variant="sm" color="warning" style={styles.mtSm}>
            Badge: {q.badge}
          </Text>
          <Text variant="xs" color="textSecondary" style={styles.mtSm}>
            {q.accuracy >= 75
              ? 'Great work. Keep seeking wisdom in His word.'
              : 'Stay encouraged. Every quiz helps you grow in faith.'}
          </Text>
        </Card>
      </View>
      <View style={[styles.bottomBar, { paddingBottom: spacing.lg + tabBarPad }]}>
        <Button title="Retry Quiz" onPress={q.retryQuiz} style={styles.flexButton} />
        <Button variant="surface" title="Share Score" onPress={onShareScore} style={styles.flexButton} />
        <Button variant="surface" title="View Leaderboard" onPress={q.openLeaderboard} style={styles.flexButton} />
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
  resumeCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  resumeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
