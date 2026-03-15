import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '../../../components/ui/Text';
import Badge from '../../../components/ui/Badge';
import Avatar from '../../../components/ui/Avatar';
import { spacing } from '../../../theme/spacing';
import { GlassSurface } from '../../../components/ui/GlassSurface';

export const Header: React.FC = React.memo(() => {
  return (
    <GlassSurface elevated style={styles.glass}>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text variant="xl" bold>
            DreamTales
          </Text>
          <Badge label="Coins: 120" variant="gold" />
        </View>
        <Avatar size={36} glow />
      </View>
    </GlassSurface>
  );
});

const styles = StyleSheet.create({
  glass: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  left: {
    gap: spacing.sm,
  },
});

export default Header;
