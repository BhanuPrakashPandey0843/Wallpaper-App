import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../ui/Text';
import { colors } from '../../../theme/colors';

interface Props {
  title: string;
  subtitle?: string | null;
}

export const HeaderTitle: React.FC<Props> = React.memo(({ title, subtitle }) => {
  return (
    <View>
      <Text variant="h3" bold style={styles.title}>
        {title}
      </Text>
      {subtitle && (
        <Text variant="xs" style={styles.subtitle}>
          {subtitle}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  title: {
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: -2,
  },
});

export default HeaderTitle;
