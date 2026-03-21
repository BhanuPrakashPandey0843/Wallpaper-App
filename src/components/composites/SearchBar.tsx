import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TextInput, ViewStyle, Pressable } from 'react-native';
import { MotiView } from 'moti';
import { Search, Mic, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { colors } from '../../theme/colors';

interface Props {
  placeholder?: string;
  onSearch?: (text: string) => void;
  style?: ViewStyle | ViewStyle[];
}

export const SearchBar: React.FC<Props> = React.memo(
  ({ placeholder = "Search for a story", onSearch, style }) => {
    const [value, setValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    
    const micScale = useSharedValue(1);
    const micAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: micScale.value }]
    }));

    const onChangeText = useCallback((text: string) => {
      setValue(text);
      onSearch?.(text);
    }, [onSearch]);

    const onClear = useCallback(() => {
      setValue('');
      onSearch?.('');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, [onSearch]);

    const onMicPressIn = () => {
      micScale.value = withSpring(0.9, { damping: 10 });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const onMicPressOut = () => {
      micScale.value = withSpring(1, { damping: 10 });
    };

    return (
      <MotiView
        style={[styles.root, style]}
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400 }}
      >
        <View style={[
          styles.searchBox, 
          isFocused && styles.searchBoxFocused
        ]}>
          
          <Search size={20} color={isFocused ? colors.accent : colors.textSecondary} />

          <TextInput
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            selectionColor={colors.accent}
          />

          {value.length > 0 && (
            <Pressable onPress={onClear} style={styles.clearButton}>
              <X size={16} color={colors.textSecondary} />
            </Pressable>
          )}

          <Pressable 
            onPressIn={onMicPressIn}
            onPressOut={onMicPressOut}
            style={styles.micButton}
          >
            <Animated.View style={micAnimatedStyle}>
              <Mic size={18} color="#FFF" />
            </Animated.View>
          </Pressable>

        </View>
      </MotiView>
    );
  }
);

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing.md,
  },

  searchBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.pill,
    paddingLeft: spacing.md,
    paddingRight: 6,
    minHeight: 56,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  },

  searchBoxFocused: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(255, 125, 51, 0.05)',
  },

  input: {
    flex: 1,
    marginLeft: spacing.sm,
    color: colors.textPrimary,
    fontSize: 16,
    height: '100%',
  },

  clearButton: {
    padding: 8,
    marginRight: 4,
  },

  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default SearchBar;