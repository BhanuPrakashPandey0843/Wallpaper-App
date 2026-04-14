import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle,
  Platform
} from 'react-native';
import { spacing } from '../../../theme/spacing';

interface SocialButtonProps {
  title: string;
  onPress: () => void;
  type: 'google' | 'facebook';
  disabled?: boolean;
  style?: ViewStyle;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  title,
  onPress,
  type,
  disabled = false,
  style,
}) => {
  const brand = type === 'google' ? 'G' : 'f';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.button, disabled ? styles.disabled : null, style]}
    >
      <Text style={[styles.iconText, type === 'facebook' ? styles.facebookText : null]}>{brand}</Text>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: spacing.xs,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconText: {
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 16,
    marginRight: spacing.sm,
    color: '#DB4437',
    fontFamily: 'Poppins_700Bold',
    backgroundColor: '#F9FAFB',
  },
  facebookText: {
    color: '#1877F2',
    marginRight: spacing.sm,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'Poppins_600SemiBold',
  },
  disabled: {
    opacity: 0.6,
  },
});
