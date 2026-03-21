import { StyleSheet } from 'react-native';
import { spacing } from '../../../theme/spacing';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md, // Align with the rest of the app content
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: '#0F0F0F', // Match CategoriesSection background
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
