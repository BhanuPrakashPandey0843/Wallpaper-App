import { MotiTransition } from 'moti';

export const fadeIn = {
  from: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { type: 'timing', duration: 250 } as MotiTransition,
};

export const slideUp = {
  from: { opacity: 0, translateY: 8 },
  animate: { opacity: 1, translateY: 0 },
  transition: { type: 'timing', duration: 250 } as MotiTransition,
};

export const scalePress = {
  pressed: 0.96,
  released: 1,
};
