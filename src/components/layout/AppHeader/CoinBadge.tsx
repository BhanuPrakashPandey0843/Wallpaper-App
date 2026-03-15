import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withSpring } from 'react-native-reanimated';
import Text from '../../ui/Text';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';

interface Props {
  coins: number;
  multiplier?: number | null;
  premium?: boolean;
  accessibleLabel: string;
}

export const CoinBadge: React.FC<Props> = React.memo(({ coins, multiplier, premium, accessibleLabel }) => {
  const prev = useRef<number>(coins);
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: glow.value,
  }));

  useEffect(() => {
    if (coins > prev.current) {
      scale.value = withSequence(withSpring(1.2, { damping: 12 }), withSpring(1, { damping: 12 }));
      glow.value = withSpring(0.35, { damping: 20 });
      glow.value = withSpring(0.15, { damping: 20 });
    } else if (coins < prev.current) {
      // subtle red flash could be added; keep performance-friendly
      scale.value = withSpring(0.98, { damping: 12 });
      scale.value = withSpring(1, { damping: 12 });
    }
    prev.current = coins;
  }, [coins, glow, scale]);

  return (
    <Animated.View accessibilityLabel={accessibleLabel} style={[styles.root, animatedStyle]}>
      <LinearGradient colors={[colors.goldStart, colors.goldEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradient}>
        <Text variant="sm" bold>
          {coins}
        </Text>
        {multiplier ? (
          <View style={styles.mult}>
            <Text variant="xs" bold>
              x{multiplier}
            </Text>
          </View>
        ) : null}
      </LinearGradient>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  root: {
    minHeight: 32,
    borderRadius: radius.pill,
    overflow: 'hidden',
    shadowColor: colors.goldStart,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    gap: spacing.xs,
  },
  mult: {
    marginLeft: spacing.xs,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.glass,
  },
});

export default CoinBadge;
