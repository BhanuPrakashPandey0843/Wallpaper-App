import React from 'react';
import { View } from 'react-native';
import Text from '../../ui/Text';
import { styles } from './styles';
import { MotiView } from 'moti';

interface Props {
  title: string;
  subtitle?: string | null;
}

export const HeaderTitle: React.FC<Props> = React.memo(({ title, subtitle }) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 6 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 250 }}
    >
      <View style={styles.left}>
        <Text variant="xl" bold style={styles.title} accessibilityLabel={title}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="sm" color="textSecondary" accessibilityLabel={subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </MotiView>
  );
});

export default HeaderTitle;
