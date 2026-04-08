import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../components/ui/Text';
import { quizTheme } from '../theme';

export interface SegmentItem<T extends string> {
  id: T;
  label: string;
}

interface Props<T extends string> {
  items: SegmentItem<T>[];
  value: T;
  onChange: (v: T) => void;
}

export function QuizSegmentedControl<T extends string>({ items, value, onChange }: Props<T>) {
  return (
    <View style={styles.track}>
      {items.map((item) => {
        const active = item.id === value;
        return (
          <Pressable
            key={item.id}
            onPress={() => onChange(item.id)}
            style={[styles.segment, active && styles.segmentActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text
              variant="xs"
              bold
              style={[styles.label, { color: active ? '#0B0D12' : quizTheme.textMuted }]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: quizTheme.surfaceMuted,
    borderRadius: 999,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: quizTheme.lime,
  },
  label: {
    textAlign: 'center',
  },
});
