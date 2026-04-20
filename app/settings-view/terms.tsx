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
  FileText,
  ArrowLeft,
  Mail,
  Scale,
} from 'lucide-react-native';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

import Text from '../../src/components/ui/Text';

// --- Warm Spiritual Colors (Strictly NO GREY) ---
const COLORS = {
  primary: '#F4792B',
  primaryLight: '#FF9D5C',
  espresso: '#3D1F00',
  warmBrown: '#7D5A44',
  terracotta: '#A67C52',
  softPeach: '#FFF9F2',
  deepTerracotta: '#4D3B2E',
};

const TERMS_SECTIONS = [
  {
    title: 'Introduction',
    content: 'By downloading or using Faith Frames, these terms will automatically apply to you. You should make sure that you read them carefully before using the app. You are not allowed to copy or modify the app, any part of the app, or our trademarks in any way.',
  },
  {
    title: 'Eligibility',
    content: 'To use Faith Frames, you must be at least 13 years old. By using the app, you represent and warrant that you have the right, authority, and capacity to enter into this agreement and to abide by all of its terms.',
  },
  {
    title: 'User Conduct',
    content: 'You are responsible for your own behavior within the app. This includes respecting other users, following community guidelines, and not using the app for any illegal or unauthorized purpose.',
  },
  {
    title: 'Intellectual Property',
    content: 'The app and all its original content, features, and functionality are and will remain the exclusive property of Faith Frames. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.',
  },
  {
    title: 'Subscriptions & Payments',
    content: 'Faith Frames offers premium features via subscriptions. Payments will be charged to your account at confirmation of purchase. Subscriptions automatically renew unless auto-renew is turned off at least 24 hours before the end of the current period.',
  },
  {
    title: 'Prohibited Conduct',
    content: 'You agree not to engage in any prohibited activities: copying, distributing, or disclosing any part of the app in any medium; using any automated system to access the app.',
  },
  {
    title: 'Disclaimers',
    content: 'Your use of the app is at your sole risk. The app is provided on an "AS IS" and "AS AVAILABLE" basis. Faith Frames does not warrant that the app will function uninterrupted or be secure at all times.',
  },
  {
    title: 'Limitation of Liability',
    content: 'In no event shall Faith Frames be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.',
  },
  {
    title: 'Termination',
    content: 'We may terminate or suspend your account immediately, without prior notice, for any reason whatsoever, including without limitation if you breach the Terms.',
  },
  {
    title: 'Changes to Terms',
    content: 'We reserve the right to modify or replace these terms at any time. Material changes will be notified 30 days in advance.',
  },
];

export default function TermsScreen() {
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
            <Text bold style={styles.titleText}>Terms of Service</Text>
            <Text style={styles.subtitleText}>Legal agreement & rules</Text>
          </View>
        </MotiView>

        {/* Minimalist Intro */}
        <MotiView
          from={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 800 }}
          style={styles.introCard}
        >
          <Scale size={40} color={COLORS.primary} style={styles.introIcon} />
          <Text style={styles.introText}>
            By using Faith Frames, you agree to our <Text bold color="primary">Terms and Conditions.</Text> Please read them carefully to understand your rights.
          </Text>
        </MotiView>

        {/* Clean Content Sections */}
        <View style={styles.contentWrapper}>
          {TERMS_SECTIONS.map((section, index) => (
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
            onPress={() => { if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.back(); }}
          >
            <FileText size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text bold style={styles.primaryBtnText}>Accept All Terms</Text>
          </Pressable>

          <Pressable 
            style={styles.secondaryBtn}
            onPress={() => { if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
          >
            <Mail size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
            <Text bold style={styles.secondaryBtnText}>Contact Legal</Text>
          </Pressable>

          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>Agreement v2.1.0</Text>
            <Text style={styles.versionText}>Effective {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>
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
