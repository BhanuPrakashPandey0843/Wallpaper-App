import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  ShieldCheck,
  ArrowLeft,
  Mail,
  ExternalLink,
} from 'lucide-react-native';
import { MotiView, MotiText } from 'moti';
import * as Haptics from 'expo-haptics';

import Text from '../../src/components/ui/Text';

// --- Warm Spiritual Colors (Strictly NO GREY) ---
const COLORS = {
  primary: '#F4792B',
  primaryLight: '#FF9D5C',
  espresso: '#3D1F00',     // Rich deep brown for text
  warmBrown: '#7D5A44',    // Soft medium brown for secondary text
  terracotta: '#A67C52',   // Earthy accent color
  softPeach: '#FFF9F2',    // Very light peach background
  warmOrange: '#FFDAB9',   // Warm accent orange
  cardBg: 'rgba(255, 255, 255, 0.7)',
};

const POLICY_SECTIONS = [
  {
    title: 'Data We Collect',
    content: 'We collect minimal information to provide a seamless experience. This includes device identifiers, basic app usage metrics, and your saved preferences (like favorite verses and downloaded wallpapers). If you create an account, we securely store your email and name.',
  },
  {
    title: 'How We Use Data',
    content: 'Your data is used exclusively to personalize your spiritual journey. We use it to sync your progress across devices, recommend relevant prayers, and improve app performance. We never share your personal information with advertisers.',
  },
  {
    title: 'Data Security',
    content: 'Security is our priority. We use industry-standard AES encryption and secure Firebase infrastructure to protect your data. Regular security audits ensure your prayers, notes, and personal details remain private and protected.',
  },
  {
    title: 'Third-Party Services',
    content: 'We partner with trusted services like Google Firebase for authentication and database management, and Expo for analytics. These partners are strictly prohibited from using your data for any purpose other than providing services to Faith Frames.',
  },
  {
    title: 'Offline Usage',
    content: 'Many features of Faith Frames, including Bible reading and quizzes, work entirely offline. Data generated during offline sessions is stored locally on your device and only synced when a secure connection is established.',
  },
  {
    title: 'Permissions',
    content: 'We request access to your device storage only to save wallpapers you choose to download. Notification permissions are used for daily verse reminders. You can manage these at any time in your device settings.',
  },
  {
    title: 'Children’s Privacy',
    content: 'Faith Frames is a family-friendly app. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with data, please contact us immediately for prompt deletion.',
  },
  {
    title: 'Your Rights',
    content: 'You have full control over your data. You can request a copy of your data, update your information, or delete your account and all associated data permanently through the app settings at any time.',
  },
  {
    title: 'Policy Updates',
    content: 'We may refine this policy to reflect new features or legal requirements. When significant changes occur, we will notify you through the app. Your continued use signifies acceptance of the updated terms.',
  },
  {
    title: 'Contact Us',
    content: 'Have questions or concerns about your privacy? Our dedicated support team is here to help. Reach out to us at support@faithframes.app or through the "Contact Support" button below.',
  },
];

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  const handleBack = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <LinearGradient colors={[COLORS.softPeach, '#FFEEDD']} style={StyleSheet.absoluteFill} />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Simple Aesthetic Header */}
        <MotiView 
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.header}
        >
          <Pressable onPress={handleBack} style={styles.backBtn}>
            <ArrowLeft size={24} color={COLORS.espresso} />
          </Pressable>
          <View style={styles.headerText}>
            <Text bold style={styles.titleText}>Privacy Policy</Text>
            <Text style={styles.subtitleText}>Your data, your control</Text>
          </View>
        </MotiView>

        {/* Minimalist Intro */}
        <MotiView
          from={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 800 }}
          style={styles.introCard}
        >
          <ShieldCheck size={40} color={COLORS.primary} style={styles.introIcon} />
          <Text style={styles.introText}>
            Faith Frames respects your privacy. We collect minimal data to improve your experience and <Text bold color="primary">never sell your data.</Text>
          </Text>
        </MotiView>

        {/* Clean Content Sections */}
        <View style={styles.contentWrapper}>
          {POLICY_SECTIONS.map((section, index) => (
            <MotiView
              key={index}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 100 * index }}
              style={styles.section}
            >
              <Text bold style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionContent}>{section.content}</Text>
            </MotiView>
          ))}
        </View>

        {/* Aesthetic Footer Actions */}
        <View style={styles.footer}>
          <Pressable 
            style={styles.primaryBtn}
            onPress={() => { if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
          >
            <ExternalLink size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text bold style={styles.primaryBtnText}>Full Privacy Policy</Text>
          </Pressable>

          <Pressable 
            style={styles.secondaryBtn}
            onPress={() => { if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
          >
            <Mail size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
            <Text bold style={styles.secondaryBtnText}>Contact Support</Text>
          </Pressable>

          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>Version v1.0.4</Text>
            <Text style={styles.versionText}>Updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>
          </View>
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
    marginBottom: 40,
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
  introCard: {
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#FFF',
    alignItems: 'center',
    marginBottom: 40,
    elevation: 4,
    shadowColor: COLORS.espresso,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
  },
  introIcon: {
    marginBottom: 16,
  },
  introText: {
    textAlign: 'center',
    lineHeight: 24,
    color: COLORS.deepTerracotta,
    fontSize: 16,
  },
  contentWrapper: {
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    color: COLORS.espresso,
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 15,
    color: COLORS.warmBrown,
    lineHeight: 22,
  },
  footer: {
    marginTop: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  primaryBtn: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 16,
  },
  secondaryBtn: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  secondaryBtnText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  versionInfo: {
    alignItems: 'center',
    opacity: 0.6,
  },
  versionText: {
    fontSize: 12,
    color: COLORS.terracotta,
    marginBottom: 2,
  },
});
