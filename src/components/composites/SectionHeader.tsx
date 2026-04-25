import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Text from '../ui/Text';
import { spacing } from '../../theme/spacing';
import { colors } from '../../theme/colors';

interface Props {
  title: string;
  onActionPress?: () => void;
  actionLabel?: string;
}

export const SectionHeader: React.FC<Props> = React.memo(({ title, onActionPress, actionLabel = 'See all' }) => {
  return (
    <View style={styles.container} accessibilityRole="header">
      <View style={styles.titleContainer}>
        <Text variant="lg" bold style={styles.title}>
          {title}
        </Text>
        <View style={styles.dot} />
      </View>
      
      {onActionPress && (
        <Pressable onPress={onActionPress} style={styles.actionBtn}>
          <Text variant="xs" bold style={styles.actionText}>
            {actionLabel.toUpperCase()}
          </Text>
        </Pressable>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    letterSpacing: -0.5,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginTop: 4,
  },
  actionBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionText: {
    color: colors.accent,
    fontSize: 10,
    letterSpacing: 1,
    opacity: 0.8,
  },
});

export default SectionHeader;
