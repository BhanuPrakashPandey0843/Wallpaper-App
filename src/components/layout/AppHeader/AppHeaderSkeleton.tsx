import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '../../../theme/spacing';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { styles as headerStyles } from './styles';
import { MotiView } from 'moti';

export const AppHeaderSkeleton: React.FC = React.memo(() => {
  return (
    <View style={headerStyles.container}>
      <View style={headerStyles.row}>
        <View style={headerStyles.left}>
          <MotiView
            from={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 800, loop: true }}
            style={s.barLg}
          />
          <MotiView
            from={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 800, loop: true }}
            style={s.barSm}
          />
        </View>
        <View style={s.right}>
          <MotiView
            from={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 800, loop: true }}
            style={s.coin}
          />
          <MotiView
            from={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 800, loop: true }}
            style={s.avatar}
          />
        </View>
      </View>
    </View>
  );
});

const s = StyleSheet.create({
  barLg: {
    width: 180,
    height: 20,
    borderRadius: radius.md,
    backgroundColor: colors.glass,
  },
  barSm: {
    width: 120,
    height: 14,
    marginTop: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.glass,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  coin: {
    width: 72,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.glass,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.glass,
  },
});
