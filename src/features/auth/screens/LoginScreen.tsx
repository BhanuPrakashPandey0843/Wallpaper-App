import React, { useState, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Image,
  Dimensions
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
import { loginSchema, LoginFormData } from '../schemas';
import { InputField } from '../components/InputField';
import { AuthButton } from '../components/AuthButton';
import { SocialButton } from '../components/SocialButton';
import { Divider } from '../components/Divider';
import Text from '../../../components/ui/Text';
import { spacing } from '../../../theme/spacing';

const { height } = Dimensions.get('window');
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { login, loginWithGoogle, loading, error, clearError } = useAuth();
  const [secureText, setSecureText] = useState(true);
  const extra = Constants.expoConfig?.extra ?? {};
  const [request, , promptAsync] = Google.useAuthRequest({
    clientId: String(extra.googleExpoClientId ?? ''),
    iosClientId: String(extra.googleIosClientId ?? ''),
    androidClientId: String(extra.googleAndroidClientId ?? ''),
    webClientId: String(extra.googleWebClientId ?? ''),
  });

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onLogin = useCallback(async (data: LoginFormData) => {
    try {
      clearError();
      await login(data.email, data.password);
      router.replace('/(tabs)');
    } catch {
      // Errors are reflected from redux state.
    }
  }, [login, router, clearError]);

  const handleGoogleSignIn = async () => {
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
  };

  const handleFacebookSignIn = async () => {
    clearError();
  };

  return (
    <LinearGradient
      colors={['#FFFBF0', '#FFEEDD', '#FFDAB9']} // Peach/Orange tones gradient
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
            <Image 
              source={require('../../../../assets/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text variant="xl" bold style={styles.title}>Welcome Back</Text>
            <Text variant="sm" color="textSecondary" style={styles.subtitle}>
              Sign in to continue your spiritual journey
            </Text>
          </View>

          <View style={styles.form}>
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
                <InputField
                  label="Password"
                  placeholder="Enter your password"
                  icon="lock-closed-outline"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.password?.message}
                  secureTextEntry={secureText}
                  onToggleSecure={() => setSecureText(!secureText)}
                />
              )}
            />

            <TouchableOpacity 
              onPress={() => router.push('/forgot-password')}
              style={styles.forgotPassword}
            >
              <Text variant="xs" bold style={styles.forgotPasswordText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {error && (
              <Text variant="xs" style={styles.errorText}>
                {error}
              </Text>
            )}

            <AuthButton
              title="Login"
              onPress={handleSubmit(onLogin)}
              loading={loading.login}
              disabled={!isValid || loading.login}
              style={styles.loginButton}
            />

            <Divider text="OR" />

            <View style={styles.socialRow}>
              <SocialButton
                type="google"
                title="Google"
                onPress={handleGoogleSignIn}
                disabled={!request}
                style={styles.socialButton}
              />
              <SocialButton
                type="facebook"
                title="Facebook"
                onPress={handleFacebookSignIn}
                style={styles.socialButton}
              />
            </View>

            <TouchableOpacity
              onPress={() => router.push('/otp-verification')}
              style={styles.phoneCta}
            >
              <Text variant="xs" bold style={styles.phoneCtaText}>
                Continue with Phone OTP
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text variant="sm" color="textSecondary">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text variant="sm" bold style={styles.signupText}>Sign Up</Text>
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
    paddingTop: height * 0.1,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: spacing.md,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
  },
  forgotPasswordText: {
    color: '#F4792B',
    fontFamily: 'Poppins_600SemiBold',
  },
  loginButton: {
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
  socialRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  socialButton: {
    flex: 1,
  },
  signupText: {
    color: '#F4792B',
    fontFamily: 'Poppins_600SemiBold',
  },
  phoneCta: {
    marginTop: spacing.md,
    alignSelf: 'center',
  },
  phoneCtaText: {
    color: '#F4792B',
    fontFamily: 'Poppins_600SemiBold',
  },
});
