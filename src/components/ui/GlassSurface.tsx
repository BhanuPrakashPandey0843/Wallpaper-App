import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';

interface Props {
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
  elevated?: boolean;
}

export const GlassSurface: React.FC<Props> = React.memo(({ style, children, elevated }) => {
  return <View style={[styles.root, elevated ? shadows.md : undefined, style]}>{children}</View>;
});

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.glass,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassBorder,
  },
});

export default GlassSurface;
