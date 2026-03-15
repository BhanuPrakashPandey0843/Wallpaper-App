import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';

interface Props {
  style?: ViewStyle | ViewStyle[];
  elevated?: boolean;
  children?: React.ReactNode;
}

export const Card: React.FC<Props> = React.memo(({ style, elevated, children }) => {
  return <View style={[styles.root, elevated ? shadows.md : undefined, style]}>{children}</View>;
});

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
});

export default Card;
