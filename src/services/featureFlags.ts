export type FeatureFlags = {
  enableGreeting: boolean;
  enablePremiumGlow: boolean;
  enableCoinTooltip: boolean;
  enableDailyBonus: boolean;
};

const bool = (val: string | undefined, fallback: boolean): boolean => {
  if (val === undefined) return fallback;
  return val === '1' || val === 'true';
};

export const getFeatureFlags = (): FeatureFlags => ({
  enableGreeting: bool(process.env.EXPO_PUBLIC_ENABLE_GREETING, false),
  enablePremiumGlow: bool(process.env.EXPO_PUBLIC_ENABLE_PREMIUM_GLOW, true),
  enableCoinTooltip: bool(process.env.EXPO_PUBLIC_ENABLE_COIN_TOOLTIP, false),
  enableDailyBonus: bool(process.env.EXPO_PUBLIC_ENABLE_DAILY_BONUS, false),
});
