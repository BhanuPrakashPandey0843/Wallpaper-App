import React, { useState, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Image,
  Dimensions,
  Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { useAuth } from '../hooks/useAuth';
import { signupSchema, SignupFormData } from '../schemas';
import { InputField } from '../components/InputField';
import { AuthButton } from '../components/AuthButton';
import { SocialButton } from '../components/SocialButton';
import { Divider } from '../components/Divider';
import Text from '../../../components/ui/Text';
import { spacing } from '../../../theme/spacing';

const { height } = Dimensions.get('window');
WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen() {
  const router = useRouter();
  const { signup, loginWithGoogle, loading, error, clearError } = useAuth();
  const [secureText, setSecureText] = useState(true);
  const extra = Constants.expoConfig?.extra ?? {};
  const [request, , promptAsync] = Google.useAuthRequest({
    clientId: String(extra.googleExpoClientId ?? ''),
    iosClientId: String(extra.googleIosClientId ?? ''),
    androidClientId: String(extra.googleAndroidClientId ?? ''),
    webClientId: String(extra.googleWebClientId ?? ''),
  });

  const { control, handleSubmit, watch, formState: { errors, isValid } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    }
  });

  const password = watch('password', '');

  const getPasswordStrength = () => {
    if (password.length === 0) return null;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    
    if (score === 1) return { label: 'Weak', color: '#FF4B4B' };
    if (score === 2) return { label: 'Medium', color: '#FFB800' };
    if (score === 3) return { label: 'Strong', color: '#7ED321' };
    return null;
  };

  const strength = getPasswordStrength();
  const passwordStrengthWidth: `${number}%` = `${Math.min(100, (password.length / 12) * 100)}%`;

  const onSignup = useCallback(async (data: SignupFormData) => {
    try {
      await signup(data.name, data.email, data.password);
      router.replace('/success?type=email_verification_sent');
    } catch {
      // Error handled by redux auth state.
    }
  }, [signup, router]);

  const handleGoogleSignup = useCallback(async () => {
    clearError();
    const result = await promptAsync();
    if (result.type !== 'success') return;
    const idToken = result.authentication?.idToken;
    if (!idToken) return;
    try {
      await loginWithGoogle(idToken);
      router.replace('/(tabs)');
    } catch {
      // Redux state contains mapped error.
    }
  }, [clearError, promptAsync, loginWithGoogle, router]);

  return (
    <LinearGradient
      colors={['#FFFBF0', '#FFEEDD', '#FFDAB9']}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text variant="xl" bold style={styles.title}>Create Account</Text>
            <Text variant="sm" color="textSecondary" style={styles.subtitle}>
              Join our community and start your journey
            </Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Full Name"
                  placeholder="Enter your name"
                  icon="person-outline"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Email Address"
                  placeholder="Enter your email"
                  icon="mail-outline"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.email?.message}
                  keyboardType="email-address"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <InputField
                    label="Password"
                    placeholder="Create a password"
                    icon="lock-closed-outline"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.password?.message}
                    secureTextEntry={secureText}
                    onToggleSecure={() => setSecureText(!secureText)}
                  />
                  {strength && (
                    <View style={styles.strengthContainer}>
                      <View style={[styles.strengthBar, { backgroundColor: strength.color, width: passwordStrengthWidth }]} />
                      <Text variant="xs" style={{ color: strength.color }}>{strength.label}</Text>
                    </View>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Confirm Password"
                  placeholder="Repeat your password"
                  icon="lock-closed-outline"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.confirmPassword?.message}
                  secureTextEntry={secureText}
                />
              )}
            />

            <Controller
              control={control}
              name="terms"
              render={({ field: { onChange, value } }) => (
                <View style={styles.termsContainer}>
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{ false: '#E5E7EB', true: '#F4792B' }}
                    thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : value ? '#F4792B' : '#F3F4F6'}
                  />
                  <Text variant="xs" style={styles.termsText}>
                    I agree to the <Text variant="xs" bold style={styles.link}>Terms & Conditions</Text>
                  </Text>
                </View>
              )}
            />
            {errors.terms && (
              <Text variant="xs" style={styles.errorText}>{errors.terms.message}</Text>
            )}

            {error && (
              <Text variant="xs" style={styles.errorText}>{error}</Text>
            )}

            <AuthButton
              title="Sign Up"
              onPress={handleSubmit(onSignup)}
              loading={loading.signup}
              disabled={!isValid || loading.signup}
              style={styles.signupButton}
            />

            <Divider text="OR" />

            <SocialButton
              type="google"
              title="Google"
              onPress={handleGoogleSignup}
              disabled={!request}
            />

            <View style={styles.footer}>
              <Text variant="sm" color="textSecondary">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text variant="sm" bold style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.08,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    color: '#1A1A1A',
    marginBottom: spacing.xs,
    fontFamily: 'Poppins_700Bold',
  },
  subtitle: {
    textAlign: 'center',
    paddingHorizontal: 20,
    fontFamily: 'Poppins_400Regular',
  },
  form: {
    width: '100%',
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -8,
    marginBottom: spacing.md,
  },
  strengthBar: {
    height: 4,
    borderRadius: 2,
    marginRight: 8,
    maxWidth: 100,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  termsText: {
    marginLeft: 8,
    color: '#666666',
    fontFamily: 'Poppins_400Regular',
  },
  link: {
    color: '#F4792B',
  },
  signupButton: {
    marginTop: spacing.sm,
  },
  errorText: {
    color: '#FF4B4B',
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontFamily: 'Poppins_400Regular',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  loginText: {
    color: '#F4792B',
    fontFamily: 'Poppins_600SemiBold',
  },
});
