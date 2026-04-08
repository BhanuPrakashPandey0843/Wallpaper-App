import React from 'react';
import { StyleSheet, View } from 'react-native';
import { quizTheme } from '../theme';

export const QuizHomeSkeleton = React.memo(function QuizHomeSkeleton() {
  return (
    <View style={styles.root}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={[styles.bar, { opacity: 0.55 - i * 0.06 }]} />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    padding: 24,
    gap: 16,
  },
  bar: {
    height: 88,
    borderRadius: 20,
    backgroundColor: quizTheme.surfaceCard,
  },
});
