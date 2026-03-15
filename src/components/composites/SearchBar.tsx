import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TextInput, ViewStyle } from 'react-native';
import { MotiView } from 'moti';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { colors } from '../../theme/colors';
import Button from '../ui/Button';

interface Props {
  placeholder?: string;
  onSearch?: (text: string) => void;
  style?: ViewStyle | ViewStyle[];
}

export const SearchBar: React.FC<Props> = React.memo(({ placeholder, onSearch, style }) => {
  const [value, setValue] = useState('');

  const onChangeText = useCallback((text: string) => {
    setValue(text);
  }, []);

  const onSubmit = useCallback(() => {
    if (onSearch) onSearch(value);
  }, [onSearch, value]);

  return (
    <MotiView
      style={[styles.root, style]}
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 250 }}
    >
      <View style={styles.glass}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          accessibilityLabel="Search"
          style={styles.input}
        />
        <Button title="Mic" onPress={() => {}} variant="surface" />
        <Button title="Go" onPress={onSubmit} variant="primary" />
      </View>
    </MotiView>
  );
});

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing.md,
  },
  glass: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 56,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassBorder,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
});

export default SearchBar;
