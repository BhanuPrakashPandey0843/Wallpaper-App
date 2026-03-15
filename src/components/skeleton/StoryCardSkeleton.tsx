import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { colors } from '../../theme/colors';
import { MotiView } from 'moti';

interface Props {
  width: number;
  height: number;
}

export const StoryCardSkeleton: React.FC<Props> = React.memo(({ width, height }) => {
  return (
    <View style={styles.root}>
      <MotiView
        from={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 800, loop: true }}
        style={[styles.card, { width, height, borderRadius: radius.lg }]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    marginRight: spacing.md,
  },
  card: {
    backgroundColor: colors.glass,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassBorder,
  },
});
