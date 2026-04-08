import React, { useMemo, useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';
import { useFloatingTabBarPadding } from '../../../components/navigation/floatingTabBarPadding';
import { FlashList } from '@shopify/flash-list';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown } from 'lucide-react-native';
import { MotiView } from 'moti';
import Text from '../../../components/ui/Text';
import { quizTheme } from '../theme';
import type { LeaderboardPeriod } from '../types';
import { getLeaderboardForPeriod, getPodium } from '../leaderboardData';
import { QuizScreenChrome } from './QuizScreenChrome';
import { QuizSegmentedControl } from './QuizSegmentedControl';

interface Props {
  onBack: () => void;
}

const PERIODS: { id: LeaderboardPeriod; label: string }[] = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
];

export const QuizLeaderboardView = React.memo(function QuizLeaderboardView({ onBack }: Props) {
  const tabBarPad = useFloatingTabBarPadding();
  const [period, setPeriod] = useState<LeaderboardPeriod>('daily');
  const entries = useMemo(() => getLeaderboardForPeriod(period), [period]);
  const podium = useMemo(() => getPodium(entries), [entries]);
  const listData = useMemo(() => entries.filter((e) => e.rank > 3), [entries]);

  const onShare = () => {
    void Share.share({
      message: `I'm climbing the Faith Frames leaderboard (${period}). Join me!`,
    });
  };

  const second = podium?.[1];
  const first = podium?.[0];
  const third = podium?.[2];

  return (
    <View style={styles.root}>
      <QuizScreenChrome title="Leaderboard" onBack={onBack} onShare={onShare} />
      <View style={styles.segmentWrap}>
        <QuizSegmentedControl items={PERIODS} value={period} onChange={setPeriod} />
      </View>

      {podium && first && second && third ? (
        <View style={styles.podiumRow}>
          <PodiumSlot place={2} entry={second} delay={120} />
          <PodiumSlot place={1} entry={first} delay={0} highlight />
          <PodiumSlot place={3} entry={third} delay={220} />
        </View>
      ) : null}

      <View style={styles.listShell}>
        <Text variant="xs" color="textSecondary" style={styles.listHeading}>
          Rankings
        </Text>
        <FlashList
          data={listData}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.listContent, { paddingBottom: 24 + tabBarPad }]}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text variant="sm" style={styles.rankCol}>
                {item.rank}
              </Text>
              <View style={styles.avatar} />
              <View style={styles.nameBlock}>
                <Text variant="sm" bold>
                  {item.displayName}
                </Text>
                <Text variant="xs" color="textSecondary">
                  {item.subtitle}
                </Text>
              </View>
              <View style={styles.scoreBlock}>
                <Text variant="lg" bold>
                  {item.score}
                </Text>
                <Text variant="xs" color="textSecondary">
                  PTS
                </Text>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
        />
      </View>
    </View>
  );
});

function PodiumSlot({
  place,
  entry,
  delay,
  highlight,
}: {
  place: 1 | 2 | 3;
  entry: { displayName: string; score: number };
  delay: number;
  highlight?: boolean;
}) {
  const height = place === 1 ? 200 : place === 2 ? 160 : 130;
  const glow: [string, string] =
    place === 1
      ? [quizTheme.goldGlow, 'transparent']
      : place === 2
        ? [quizTheme.purpleGlow, 'transparent']
        : [quizTheme.orangeGlow, 'transparent'];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 24 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 520, delay }}
      style={styles.podiumCol}
    >
      <View style={[styles.glowWrap, { height: height + 24 }]}>
        <LinearGradient colors={glow} style={StyleSheet.absoluteFill} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} />
        <View style={[styles.pillar, { height }]}>
          {place === 1 ? (
            <Crown size={22} color="#FFD700" style={styles.crown} />
          ) : (
            <View style={styles.rankBadge}>
              <Text variant="xs" bold style={{ color: '#0B0D12' }}>
                {place === 2 ? '2ND' : '3RD'}
              </Text>
            </View>
          )}
          <View style={[styles.podiumAvatar, highlight && styles.podiumAvatarWinner]} />
          {highlight ? (
            <View style={styles.winnerPill}>
              <Text variant="xs" bold style={{ color: '#0B0D12' }}>
                WINNER
              </Text>
            </View>
          ) : null}
          <Text variant="xs" bold style={styles.podiumName} numberOfLines={1}>
            {entry.displayName}
          </Text>
          <Text variant="sm" bold style={{ color: quizTheme.lime }}>
            {entry.score}
          </Text>
        </View>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: quizTheme.bgDeep,
  },
  segmentWrap: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  podiumRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    gap: 6,
    minHeight: 240,
  },
  podiumCol: {
    flex: 1,
    maxWidth: 118,
    alignItems: 'center',
  },
  glowWrap: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  pillar: {
    marginHorizontal: 2,
    borderRadius: 20,
    backgroundColor: quizTheme.surfaceCard,
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: quizTheme.divider,
  },
  crown: {
    marginBottom: 4,
  },
  rankBadge: {
    backgroundColor: quizTheme.lime,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 6,
  },
  podiumAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: quizTheme.surfaceMuted,
    marginBottom: 6,
  },
  podiumAvatarWinner: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  winnerPill: {
    backgroundColor: quizTheme.lime,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  podiumName: {
    color: '#FFF',
    marginBottom: 2,
    textAlign: 'center',
  },
  listShell: {
    flex: 1,
    marginTop: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: quizTheme.surfaceCard,
    borderRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
  listHeading: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 24,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  rankCol: {
    width: 28,
    color: quizTheme.textMuted,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: quizTheme.surfaceMuted,
    marginRight: 12,
  },
  nameBlock: {
    flex: 1,
  },
  scoreBlock: {
    alignItems: 'flex-end',
  },
  sep: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: quizTheme.divider,
    marginLeft: 80,
  },
});
