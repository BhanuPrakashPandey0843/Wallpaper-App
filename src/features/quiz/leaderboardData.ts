import type { LeaderboardEntry, LeaderboardPeriod } from './types';

const baseDaily: LeaderboardEntry[] = [
  { id: 'd1', rank: 1, displayName: 'Sarah V.', score: 2840, subtitle: '18 day streak', isCurrentUser: false },
  { id: 'd2', rank: 2, displayName: 'Marcus T.', score: 2510, subtitle: 'Scholar', isCurrentUser: false },
  { id: 'd3', rank: 3, displayName: 'Elena R.', score: 2395, subtitle: 'Runner', isCurrentUser: false },
  { id: 'd4', rank: 4, displayName: 'James K.', score: 1980, subtitle: '12 day streak', isCurrentUser: false },
  { id: 'd5', rank: 5, displayName: 'Amira S.', score: 1840, subtitle: 'Early bird', isCurrentUser: false },
  { id: 'd6', rank: 6, displayName: 'David L.', score: 1720, subtitle: 'Steady', isCurrentUser: false },
  { id: 'd7', rank: 7, displayName: 'Ruth M.', score: 1590, subtitle: 'Newcomer', isCurrentUser: false },
  { id: 'me', rank: 8, displayName: 'You', score: 1420, subtitle: 'Keep going', isCurrentUser: true },
  { id: 'd9', rank: 9, displayName: 'Chris P.', score: 1380, subtitle: 'Runner', isCurrentUser: false },
  { id: 'd10', rank: 10, displayName: 'Nina W.', score: 1290, subtitle: 'Scholar', isCurrentUser: false },
];

const baseWeekly: LeaderboardEntry[] = baseDaily.map((e, i) => ({
  ...e,
  id: `w${e.id}`,
  rank: i + 1,
  score: Math.round(e.score * 4.2),
}));

const baseMonthly: LeaderboardEntry[] = baseDaily.map((e, i) => ({
  ...e,
  id: `m${e.id}`,
  rank: i + 1,
  score: Math.round(e.score * 18),
}));

export function getLeaderboardForPeriod(period: LeaderboardPeriod): LeaderboardEntry[] {
  switch (period) {
    case 'daily':
      return baseDaily;
    case 'weekly':
      return baseWeekly;
    case 'monthly':
      return baseMonthly;
    default:
      return baseDaily;
  }
}

export function getPodium(entries: LeaderboardEntry[]): [LeaderboardEntry, LeaderboardEntry, LeaderboardEntry] | null {
  const top = entries.filter((e) => e.rank <= 3).sort((a, b) => a.rank - b.rank);
  if (top.length < 3) return null;
  return [top[0], top[1], top[2]];
}
