import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';

interface Props {
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
}

export const Surface: React.FC<Props> = React.memo(({ style, children }) => {
  return <View style={[styles.root, style]}>{children}</View>;
});

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
  },
});

export default Surface;
