import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing } from '../../../theme/spacing';

interface DividerProps {
  text?: string;
}

export const Divider: React.FC<DividerProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      {text && (
        <Text style={styles.text}>{text}</Text>
      )}
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  text: {
    marginHorizontal: spacing.md,
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
});
