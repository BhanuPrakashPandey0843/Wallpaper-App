import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Text from '../../../components/ui/Text';
import { InputField } from '../components/InputField';
import { AuthButton } from '../components/AuthButton';
import { useAuth } from '../hooks/useAuth';
import { spacing } from '../../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function OtpVerificationScreen() {
  const router = useRouter();
  const { requestPhoneOtp, verifyPhoneOtp, loading, error, clearError } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [code, setCode] = useState('');

  const handleSendOtp = async () => {
    clearError();
    try {
      setIsSending(true);
      const result = await requestPhoneOtp(phoneNumber.trim(), null);
      if (result) {
        setVerificationId(result);
      }
    } catch {
      // Redux state contains mapped error.
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationId) return;
    clearError();
    try {
      await verifyPhoneOtp(verificationId, code.trim());
      router.replace('/(tabs)');
    } catch {
      // Redux state contains mapped error.
    }
  };

  return (
    <LinearGradient colors={['#FFFBF0', '#FFEEDD', '#FFDAB9']} style={styles.container}>
      <StatusBar style="dark" />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
      </TouchableOpacity>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="chatbubble-ellipses-outline" size={40} color="#F4792B" />
            </View>
            <Text variant="xl" bold style={styles.title}>Phone Verification</Text>
            <Text variant="sm" color="textSecondary" style={styles.subtitle}>
              Enter your phone number and verify the OTP sent by Firebase.
            </Text>
          </View>

          <View style={styles.form}>
            <InputField
              label="Phone Number"
              placeholder="+91 9876543210"
              icon="call-outline"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />

            {!verificationId ? (
              <AuthButton
                title="Send OTP"
                onPress={handleSendOtp}
                loading={isSending}
                disabled={!phoneNumber.trim() || isSending}
                style={styles.submitButton}
              />
            ) : (
              <>
                <InputField
                  label="OTP Code"
                  placeholder="Enter 6-digit code"
                  icon="shield-checkmark-outline"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                />
                <AuthButton
                  title="Verify OTP"
                  onPress={handleVerify}
                  loading={loading.verifyOtp}
                  disabled={code.trim().length < 6 || loading.verifyOtp}
                  style={styles.submitButton}
                />
              </>
            )}

            {error ? (
              <Text variant="xs" style={styles.errorText}>{error}</Text>
            ) : null}
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
    marginTop: spacing.sm,
    fontFamily: 'Poppins_400Regular',
  },
});
