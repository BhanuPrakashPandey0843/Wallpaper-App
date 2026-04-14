import React from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Pressable, 
  ViewStyle,
  TextInputProps,
  Text as RNText
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';

interface InputFieldProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  secureTextEntry?: boolean;
  onToggleSecure?: () => void;
  containerStyle?: ViewStyle;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  error,
  secureTextEntry,
  onToggleSecure,
  containerStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <RNText style={styles.label}>
          {label}
        </RNText>
      )}
      <View style={[
        styles.inputWrapper,
        error ? styles.inputError : null,
        isFocused ? styles.inputFocused : null,
      ]}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={error ? '#FF4B4B' : '#9CA3AF'} 
            style={styles.icon} 
          />
        )}
        <TextInput
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {onToggleSecure && (
          <Pressable onPress={onToggleSecure} style={styles.toggleIcon}>
            <Ionicons 
              name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'} 
              size={20} 
              color="#9CA3AF" 
            />
          </Pressable>
        )}
      </View>
      {error && (
        <RNText style={styles.errorText}>
          {error}
        </RNText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    width: '100%',
  },
  label: {
    marginBottom: spacing.xs,
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'Poppins_600SemiBold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    height: 56,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: '#FF4B4B',
  },
  inputFocused: {
    borderColor: '#F4792B',
    shadowOpacity: 0.1,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#1A1A1A',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  toggleIcon: {
    padding: spacing.xs,
  },
  errorText: {
    color: '#FF4B4B',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontFamily: 'Poppins_400Regular',
  },
});
