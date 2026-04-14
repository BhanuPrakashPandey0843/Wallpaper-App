import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../hooks/useAuth';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../schemas';
import { InputField } from '../components/InputField';
import { AuthButton } from '../components/AuthButton';
import Text from '../../../components/ui/Text';
import { spacing } from '../../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { forgotPassword, loading, error } = useAuth();

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    }
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data.email);
      router.replace('/success?type=password_reset');
    } catch {
      // Error handled by redux auth state.
    }
  };

  return (
    <LinearGradient
      colors={['#FFFBF0', '#FFEEDD', '#FFDAB9']}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="key-outline" size={40} color="#F4792B" />
            </View>
            <Text variant="xl" bold style={styles.title}>Forgot Password?</Text>
            <Text variant="sm" color="textSecondary" style={styles.subtitle}>
              Enter your email address and we'll send you instructions to reset your password.
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

            {error && (
              <Text variant="xs" style={styles.errorText}>{error}</Text>
            )}

            <AuthButton
              title="Send Reset Link"
              onPress={handleSubmit(onSubmit)}
              loading={loading.forgotPassword}
              disabled={!isValid || loading.forgotPassword}
              style={styles.submitButton}
            />
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
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.15,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF4ED',
    justifyContent: 'center',
    alignItems: 'center',
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
    lineHeight: 22,
  },
  form: {
    width: '100%',
  },
  submitButton: {
    marginTop: spacing.md,
  },
  errorText: {
    color: '#FF4B4B',
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontFamily: 'Poppins_400Regular',
  },
});
