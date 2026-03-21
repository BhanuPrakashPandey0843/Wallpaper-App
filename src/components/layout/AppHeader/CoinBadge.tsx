import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Star } from 'lucide-react-native';
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
      glow.value = withSequence(withSpring(0.35, { damping: 20 }), withSpring(0.15, { damping: 20 }));
    } else if (coins < prev.current) {
      scale.value = withSpring(0.98, { damping: 12 });
      scale.value = withSpring(1, { damping: 12 });
    }
    prev.current = coins;
  }, [coins, glow, scale]);

  return (
    <Animated.View accessibilityLabel={accessibleLabel} style={[styles.root, animatedStyle]}>
      <View style={styles.badge}>
        <Star size={14} color="#000" fill="#000" />
        <Text variant="sm" bold style={styles.text}>
          {String(coins).padStart(2, '0')}
        </Text>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  root: {
    minHeight: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.warning,
    overflow: 'hidden',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    gap: spacing.xs,
  },
  text: {
    color: '#000',
  },
});

export default CoinBadge;
