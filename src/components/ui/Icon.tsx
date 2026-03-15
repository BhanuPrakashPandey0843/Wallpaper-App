import React from 'react';
import { colors } from '../../theme/colors';

interface Props {
  component: React.ComponentType<{ color?: string; size?: number }>;
  size?: number;
  color?: keyof typeof colors;
}

export const Icon: React.FC<Props> = React.memo(({ component: Comp, size = 20, color = 'textPrimary' }) => {
  return <Comp size={size} color={colors[color]} />;
});

export default Icon;
