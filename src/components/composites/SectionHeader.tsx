import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '../ui/Text';
import Button from '../ui/Button';
import { spacing } from '../../theme/spacing';

interface Props {
  title: string;
  onActionPress?: () => void;
  actionLabel?: string;
}

export const SectionHeader: React.FC<Props> = React.memo(({ title, onActionPress, actionLabel }) => {
  return (
    <View style={styles.row} accessibilityRole="header">
      <Text variant="lg" bold style={{ color: '#FFF', fontSize: 20 }}>
        {title}
      </Text>
      {onActionPress && actionLabel ? <Button title={actionLabel} onPress={onActionPress} variant="surface" /> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
});

export default SectionHeader;
