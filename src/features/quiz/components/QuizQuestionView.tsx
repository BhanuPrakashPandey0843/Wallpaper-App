import React, { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Star, Volume2 } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFloatingTabBarPadding } from '../../../components/navigation/floatingTabBarPadding';
import * as Haptics from 'expo-haptics';
import Text from '../../../components/ui/Text';
import type { QuizQuestion } from '../questions';
import { quizTheme } from '../theme';
import { DEFAULT_TIMER_SECONDS } from '../types';
import { useQuizTimer } from '../useQuizTimer';
import { gradientForQuestion } from '../visualPresets';

const LETTER_COLORS = [quizTheme.letterA, quizTheme.letterB, quizTheme.letterC, quizTheme.letterD] as const;

interface Props {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  useTimer: boolean;
  revealed: boolean;
  timedOut: boolean;
  selectedOption: number | null;
  lastAnswerCorrect: boolean;
  pointsThisQuestion: number;
  progressRatio: number;
  timerResetToken: number;
  onPick: (index: number) => void;
  onNext: () => void;
  onTimerExpire: () => void;
}

export const QuizQuestionView = React.memo(function QuizQuestionView({
  question,
  questionIndex,
  totalQuestions,
  useTimer,
  revealed,
  timedOut,
  selectedOption,
  lastAnswerCorrect,
  pointsThisQuestion,
  progressRatio,
  timerResetToken,
  onPick,
  onNext,
  onTimerExpire,
}: Props) {
  const insets = useSafeAreaInsets();
  const tabBarPad = useFloatingTabBarPadding();
  const safeTop = Math.max(insets.top, 12);
  const scrollBottomPad = tabBarPad + (revealed ? 112 : 28);

  const timeLeft = useQuizTimer({
    durationSeconds: DEFAULT_TIMER_SECONDS,
    running: useTimer && !revealed,
    resetToken: timerResetToken,
    onExpire: onTimerExpire,
  });

  const gradient = gradientForQuestion(question.category, question.visualPreset);

  const feedbackTitle = timedOut
    ? "Time's up"
    : lastAnswerCorrect
      ? 'Woohoo! You Got It Right!'
      : 'Not quite';

  const feedbackSub =
    timedOut
      ? 'The correct answer is highlighted. Keep going!'
      : lastAnswerCorrect
        ? 'Great job — stay consistent.'
        : 'Review the answer and continue when ready.';

  const onAudioHint = useCallback(() => {
    Haptics.selectionAsync();
  }, []);

  return (
    <View style={styles.root}>
      {revealed ? (
        <MotiView
          from={{ opacity: 0, translateY: -12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 380 }}
          style={[
            styles.feedbackBanner,
            { paddingTop: safeTop + 16 },
            lastAnswerCorrect && !timedOut ? styles.bannerOk : styles.bannerBad,
          ]}
        >
          <LinearGradient
            colors={
              lastAnswerCorrect && !timedOut
                ? [quizTheme.successBanner, quizTheme.successBannerDeep]
                : timedOut
                  ? ['#FBBF24', '#D97706']
                  : [quizTheme.wrongBanner, quizTheme.wrongBannerDeep]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text variant="xl" bold style={styles.feedbackTitle}>
            {feedbackTitle}
          </Text>
          <Text variant="sm" style={styles.feedbackSub}>
            {feedbackSub}
          </Text>
          {lastAnswerCorrect && !timedOut ? (
            <View style={styles.pointPill}>
              <Star size={14} color="#0B0D12" fill="#0B0D12" />
              <Text variant="xs" bold style={{ color: '#0B0D12', marginLeft: 6 }}>
                Earn {pointsThisQuestion} Points
              </Text>
            </View>
          ) : null}
        </MotiView>
      ) : null}

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: revealed ? 16 : safeTop, paddingBottom: scrollBottomPad },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <Text variant="xs" style={{ color: quizTheme.textMuted }}>
            Question {questionIndex + 1} / {totalQuestions}
          </Text>
          {useTimer && !revealed ? (
            <View style={styles.timerPill}>
              <Text variant="xs" bold style={{ color: quizTheme.lime }}>
                {timeLeft}s
              </Text>
            </View>
          ) : null}
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.round(progressRatio * 100)}%` }]} />
        </View>

        <MotiView
          key={question.id}
          from={{ opacity: 0.6, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 320 }}
        >
          <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero} />
        </MotiView>

        <Text variant="lg" bold style={styles.questionText}>
          {question.question}
        </Text>

        <Pressable
          onPress={onAudioHint}
          style={styles.audioBtn}
          accessibilityRole="button"
          accessibilityLabel="Question audio"
        >
          <Volume2 size={18} color="#FFF" />
        </Pressable>

        <View style={styles.grid}>
          {question.options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx) as 'A' | 'B' | 'C' | 'D';
            const letterColor = LETTER_COLORS[idx] ?? quizTheme.letterA;
            const isCorrect = idx === question.correctIndex;
            const isSelected = selectedOption === idx;
            const showResult = revealed;
            const correctHighlight = showResult && isCorrect;
            const wrongPick = showResult && isSelected && !isCorrect;

            return (
              <Pressable
                key={`${question.id}-${idx}`}
                onPress={() => onPick(idx)}
                disabled={revealed}
                style={[
                  styles.optionCard,
                  correctHighlight && styles.optionCorrect,
                  wrongPick && styles.optionWrong,
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected, disabled: revealed }}
              >
                {correctHighlight ? (
                  <View style={styles.checkMark}>
                    <Check size={14} color="#FFF" strokeWidth={3} />
                  </View>
                ) : null}
                <View style={[styles.letterCircle, { backgroundColor: letterColor }]}>
                  <Text variant="sm" bold style={{ color: '#0B0D12' }}>
                    {letter}
                  </Text>
                </View>
                <Text variant="sm" bold style={styles.optionLabel}>
                  {opt}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {revealed ? (
          <View style={styles.explanation}>
            <Text variant="xs" color="textSecondary">
              Reference: {question.reference}
            </Text>
            <Text variant="xs" color="textSecondary" style={{ marginTop: 6 }}>
              {question.explanation}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      {revealed ? (
        <View style={[styles.ctaBar, { paddingBottom: 14 + tabBarPad }]}>
          <Pressable onPress={onNext} style={styles.cta} accessibilityRole="button">
            <Text variant="md" bold style={{ color: '#FFF' }}>
              {questionIndex + 1 >= totalQuestions ? 'See results' : 'Next Question'}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: quizTheme.bgDeep,
  },
  feedbackBanner: {
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  bannerOk: {},
  bannerBad: {},
  feedbackTitle: {
    color: '#FFF',
    textAlign: 'center',
  },
  feedbackSub: {
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    marginTop: 8,
  },
  pointPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  scroll: {
    paddingHorizontal: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timerPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: quizTheme.limeMuted,
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: quizTheme.surfaceMuted,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: quizTheme.lime,
  },
  hero: {
    height: 160,
    borderRadius: 20,
    marginBottom: 20,
  },
  questionText: {
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 26,
  },
  audioBtn: {
    alignSelf: 'center',
    marginTop: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: quizTheme.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    backgroundColor: quizTheme.surfaceCard,
    borderRadius: 18,
    padding: 14,
    minHeight: 108,
    borderWidth: 1,
    borderColor: quizTheme.divider,
    position: 'relative',
  },
  optionCorrect: {
    borderColor: quizTheme.successBanner,
    borderWidth: 2,
  },
  optionWrong: {
    borderColor: quizTheme.wrongBanner,
    borderWidth: 2,
  },
  checkMark: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: quizTheme.successBannerDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  optionLabel: {
    color: '#F4F4F5',
    lineHeight: 20,
  },
  explanation: {
    marginTop: 20,
    padding: 14,
    borderRadius: 16,
    backgroundColor: quizTheme.surfaceCard,
  },
  ctaBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: quizTheme.bgDeep,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: quizTheme.divider,
  },
  cta: {
    backgroundColor: quizTheme.orangeCta,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
});
