import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import Text from './Text';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'surface';
  style?: ViewStyle | ViewStyle[];
  accessibilityLabel?: string;
}

export const Button: React.FC<Props> = React.memo(({ title, onPress, variant = 'primary', style, accessibilityLabel }) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const onPressIn = () => {
    scale.value = withSpring(0.96, { damping: 15 });
  };
  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const baseStyle =
    variant === 'primary'
      ? { backgroundColor: colors.accent }
      : { backgroundColor: colors.surfaceElevated, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.textSecondary };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      style={[styles.root, baseStyle, style]}
    >
      <Animated.View style={[styles.content, animatedStyle]}>
        <Text variant="md" color="textPrimary" bold>
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  root: {
    minHeight: 44,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingVertical: spacing.sm,
  },
});

export default Button;
