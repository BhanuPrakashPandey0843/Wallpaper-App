import React from 'react';
import { 
  View, 
  StyleSheet
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { AuthButton } from '../components/AuthButton';
import Text from '../../../components/ui/Text';
import { spacing } from '../../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

export default function SuccessScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: 'account_created' | 'password_reset' | 'email_verification_sent' }>();

  const isAccountCreated = type === 'account_created';

  const config = {
    account_created: {
      title: 'Account Created 🎉',
      subtitle: 'Your account has been successfully created. Welcome to Faith Frames!',
      buttonText: 'Get Started',
      icon: 'person-add-outline',
    },
    password_reset: {
      title: 'Password Reset ✅',
      subtitle: 'Your password has been successfully reset. You can now login with your new password.',
      buttonText: 'Back to Login',
      icon: 'checkmark-circle-outline',
    },
    email_verification_sent: {
      title: 'Verify Your Email 📩',
      subtitle: 'We sent a verification link to your email. Verify your account before signing in.',
      buttonText: 'Back to Login',
      icon: 'mail-open-outline',
    }
  }[type || 'account_created'];

  const handlePress = () => {
    if (isAccountCreated) {
      router.replace('/(tabs)');
    } else {
      router.replace('/login');
    }
  };

  return (
    <LinearGradient
      colors={['#FFFBF0', '#FFEEDD', '#FFDAB9']}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name={config.icon as any} size={60} color="#F4792B" />
        </View>

        <Text variant="xl" bold style={styles.title}>{config.title}</Text>
        <Text variant="sm" color="textSecondary" style={styles.subtitle}>
          {config.subtitle}
        </Text>

        <AuthButton
          title={config.buttonText}
          onPress={handlePress}
          style={styles.button}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    shadowColor: '#F4792B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    color: '#1A1A1A',
    marginBottom: spacing.md,
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: spacing.xl,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 24,
  },
  button: {
    width: '100%',
  },
});
