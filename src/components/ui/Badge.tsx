import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import Text from './Text';

interface Props {
  label: string;
  variant?: 'accent' | 'gold';
}

export const Badge: React.FC<Props> = React.memo(({ label, variant = 'accent' }) => {
  if (variant === 'gold') {
    return (
      <LinearGradient
        colors={[colors.goldStart, colors.goldEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.root}
      >
        <Text variant="sm" color="textPrimary" bold>
          {label}
        </Text>
      </LinearGradient>
    );
  }
  return (
    <View style={[styles.root, styles.accent]} accessibilityRole="text">
      <Text variant="sm" color="textPrimary" bold>
        {label}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
    minHeight: 24,
    justifyContent: 'center',
  },
  accent: {
    backgroundColor: colors.accent,
  },
});

export default Badge;
