import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Linking,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  Mail,
  ArrowLeft,
  MessageCircle,
  Send,
  HelpCircle,
  Heart,
} from 'lucide-react-native';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

import Text from '../../src/components/ui/Text';

const { width } = Dimensions.get('window');

// --- Warm Spiritual Colors (Strictly NO GREY) ---
const COLORS = {
  primary: '#F4792B',
  primaryLight: '#FF9D5C',
  espresso: '#3D1F00',
  warmBrown: '#7D5A44',
  terracotta: '#A67C52',
  softPeach: '#FFF9F2',
  deepTerracotta: '#4D3B2E',
  inputBg: 'rgba(255, 255, 255, 0.8)',
};

const CONTACT_EMAIL = 'faithframes@gmail.com';

export default function ContactUsScreen() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleBack = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleSendEmail = async () => {
    if (!message.trim()) {
      Alert.alert('Incomplete', 'Please write a message before sending.');
      return;
    }

    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    setIsSending(true);
    const emailSubject = subject.trim() || 'Feedback for Faith Frames';
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(message.trim())}`;
    
    try {
      const canOpen = await Linking.canOpenURL(mailto);
      if (canOpen) {
        await Linking.openURL(mailto);
      } else {
        Alert.alert('Error', 'Could not open your email app. Please email us directly at faithframes@gmail.com');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while trying to open your email app.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <LinearGradient colors={[COLORS.softPeach, '#FFEEDD']} style={StyleSheet.absoluteFill} />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Aesthetic Header */}
        <MotiView 
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.header}
        >
          <Pressable onPress={handleBack} style={styles.backBtn}>
            <ArrowLeft size={24} color={COLORS.espresso} />
          </Pressable>
          <View style={styles.headerText}>
            <Text bold style={styles.titleText}>Contact Us</Text>
            <Text style={styles.subtitleText}>We'd love to hear from you</Text>
          </View>
        </MotiView>

        {/* Intro Illustration/Icon */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', delay: 100 }}
          style={styles.illustrationContainer}
        >
          <View style={styles.iconCircle}>
            <MessageCircle size={40} color="#FFF" />
          </View>
          <View style={styles.blobDecoration} />
        </MotiView>

        {/* Contact Form */}
        <View style={styles.formContainer}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 200 }}
          >
            <Text bold style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              placeholder="What is this about?"
              placeholderTextColor={COLORS.terracotta}
              value={subject}
              onChangeText={setSubject}
            />
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 300 }}
            style={styles.inputGap}
          >
            <Text bold style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Your thoughts, feedback, or questions..."
              placeholderTextColor={COLORS.terracotta}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={message}
              onChangeText={setMessage}
            />
          </MotiView>

          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 400 }}
            style={styles.inputGap}
          >
            <Pressable 
              style={({ pressed }) => [
                styles.sendBtn,
                pressed && { scale: 0.98, opacity: 0.9 }
              ]}
              onPress={handleSendEmail}
              disabled={isSending}
            >
              <Send size={20} color="#FFF" style={{ marginRight: 10 }} />
              <Text bold style={styles.sendBtnText}>Open Email App</Text>
            </Pressable>
          </MotiView>
        </View>

        {/* Support Info Cards */}
        <View style={styles.infoContainer}>
          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 500 }}
            style={styles.infoCard}
          >
            <HelpCircle size={24} color={COLORS.primary} />
            <View style={styles.infoTextContainer}>
              <Text bold style={styles.infoTitle}>Direct Support</Text>
              <Text style={styles.infoValue}>{CONTACT_EMAIL}</Text>
            </View>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 600 }}
            style={[styles.infoCard, styles.inputGap]}
          >
            <Heart size={24} color={COLORS.primary} />
            <View style={styles.infoTextContainer}>
              <Text bold style={styles.infoTitle}>We're Here to Help</Text>
              <Text style={styles.infoValue}>Usually responds within 24h</Text>
            </View>
          </MotiView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.softPeach,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    elevation: 2,
    shadowColor: COLORS.espresso,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  headerText: {
    flex: 1,
  },
  titleText: {
    fontSize: 28,
    color: COLORS.espresso,
  },
  subtitleText: {
    fontSize: 14,
    color: COLORS.warmBrown,
    marginTop: -2,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    elevation: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  blobDecoration: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.2,
    transform: [{ scale: 1.2 }],
  },
  formContainer: {
    paddingHorizontal: 24,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    color: COLORS.espresso,
    marginBottom: 10,
    marginLeft: 4,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: COLORS.espresso,
    borderWidth: 1,
    borderColor: 'rgba(244, 121, 43, 0.1)',
  },
  textArea: {
    minHeight: 150,
    paddingTop: 16,
  },
  inputGap: {
    marginTop: 24,
  },
  sendBtn: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  sendBtnText: {
    color: '#FFF',
    fontSize: 18,
  },
  infoContainer: {
    paddingHorizontal: 24,
    marginTop: 40,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    elevation: 3,
    shadowColor: COLORS.espresso,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  infoTextContainer: {
    marginLeft: 16,
  },
  infoTitle: {
    fontSize: 14,
    color: COLORS.terracotta,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.espresso,
    marginTop: 2,
  },
});
