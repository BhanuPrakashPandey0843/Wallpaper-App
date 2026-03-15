import { StyleSheet } from 'react-native';

export const shadows = {
  sm: StyleSheet.create({
    shadow: {
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
  }).shadow,
  md: StyleSheet.create({
    shadow: {
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
  }).shadow,
  lg: StyleSheet.create({
    shadow: {
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
  }).shadow,
};
