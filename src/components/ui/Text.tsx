import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { typography } from '../../theme/typography';
import { colors } from '../../theme/colors';

interface Props extends TextProps {
  variant?: keyof typeof typography.size;
  color?: keyof typeof colors;
  bold?: boolean;
}

export const Text: React.FC<Props> = React.memo(({ variant = 'md', color = 'textPrimary', bold, style, children, ...rest }) => {
  return (
    <RNText
      accessibilityRole="text"
      style={[
        {
          color: colors[color],
          fontFamily: bold ? typography.fontFamilyBold : typography.fontFamily,
          fontSize: typography.size[variant],
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
});

export default Text;
