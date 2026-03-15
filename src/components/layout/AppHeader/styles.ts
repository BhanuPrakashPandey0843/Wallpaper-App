import { StyleSheet } from 'react-native';
import { spacing } from '../../../theme/spacing';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    backgroundColor: colors.glass,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassBorder,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    gap: spacing.xs,
  },
  title: {},
});
