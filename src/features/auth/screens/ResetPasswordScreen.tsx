import React, { useState } from 'react';
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
import { z } from 'zod';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { InputField } from '../components/InputField';
import { AuthButton } from '../components/AuthButton';
import Text from '../../../components/ui/Text';
import { spacing } from '../../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);

  const { control, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    }
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true);
    try {
      // Logic for confirming password reset with Firebase would go here
      // (usually requires an 'oobCode' from the deep link)
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.replace('/success?type=password_reset');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
            <View style={styles.iconCircle}>
              <Ionicons name="lock-open-outline" size={40} color="#F4792B" />
            </View>
            <Text variant="xl" bold style={styles.title}>New Password</Text>
            <Text variant="sm" color="textSecondary" style={styles.subtitle}>
              Please enter your new password below.
            </Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="New Password"
                  placeholder="Enter new password"
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

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Confirm New Password"
                  placeholder="Repeat new password"
                  icon="lock-closed-outline"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.confirmPassword?.message}
                  secureTextEntry={secureText}
                />
              )}
            />

            <AuthButton
              title="Reset Password"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
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
});
