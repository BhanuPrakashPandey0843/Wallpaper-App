import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import Text from '../ui/Text';
import { colors } from '../../theme/colors';
import * as Haptics from 'expo-haptics';
import Icon from '../ui/Icon';
import { Home } from 'lucide-react-native';

interface Props {
  label: string;
  style?: ViewStyle | ViewStyle[];
  onPress: () => void;
  icon?: React.ComponentType<{ color?: string; size?: number }>;
}

export const CategoryChip: React.FC<Props> = React.memo(({ label, style, onPress, icon }) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const onPressIn = () => {
    scale.value = withSpring(0.96, { damping: 15 });
  };
  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={() => {
        onPressOut();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={style}
    >
      <Animated.View style={[styles.root, animatedStyle]}>
        <Animated.View style={styles.glass}>
          {icon ? <Icon component={icon} size={16} color="textSecondary" /> : <Icon component={Home} size={16} color="textSecondary" />}
          <Text variant="sm" bold style={styles.label}>
            {label}
          </Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  root: {
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  glass: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: colors.glass,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassBorder,
  },
  label: {
    marginLeft: spacing.sm,
  },
});

export default CategoryChip;
