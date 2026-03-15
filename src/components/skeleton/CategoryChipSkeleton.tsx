import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { colors } from '../../theme/colors';
import { MotiView } from 'moti';

export const CategoryChipSkeleton: React.FC = React.memo(() => {
  return (
    <MotiView
      from={{ opacity: 0.4 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'timing', duration: 800, loop: true }}
      style={styles.root}
    />
  );
});

const styles = StyleSheet.create({
  root: {
    width: 100,
    height: 44,
    marginRight: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.glass,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassBorder,
  },
});
