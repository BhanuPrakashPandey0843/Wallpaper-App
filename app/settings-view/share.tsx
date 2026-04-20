import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Platform,
  Dimensions,
  Share,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowLeft,
  Share2,
  Copy,
  Mail,
  MessageCircle,
  Users,
} from 'lucide-react-native';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';

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
};

const APP_URL = 'https://faithframes.app';
const SHARE_MESSAGE = 'Check out Faith Frames! A beautiful app for Christian wallpapers, Bible verses, and daily spiritual growth. ✨';

export default function ShareAppScreen() {
  const router = useRouter();

  const handleBack = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleShare = async () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        message: `${SHARE_MESSAGE}\n\nDownload here: ${APP_URL}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopyLink = async () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    await Clipboard.setStringAsync(APP_URL);
    // You could add a toast notification here
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <LinearGradient colors={[COLORS.softPeach, '#FFEEDD']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <ArrowLeft size={24} color={COLORS.espresso} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          style={styles.previewCard}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight]}
            style={styles.cardGradient}
          >
            <Users size={64} color="#FFF" opacity={0.2} style={styles.bgIcon} />
            <View style={styles.cardContent}>
              <View style={styles.appIconPlaceholder}>
                <Image 
                  source={require('../../assets/icon.jpg')} 
                  style={styles.appIcon}
                  resizeMode="contain"
                />
              </View>
              <Text bold style={styles.cardTitle}>Faith Frames</Text>
              <Text style={styles.cardTagline}>Spread the Faith</Text>
            </View>
          </LinearGradient>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200 }}
          style={styles.textContainer}
        >
          <Text bold style={styles.titleText}>Invite Friends</Text>
          <Text style={styles.subtitleText}>Help your loved ones stay inspired every day with beautiful wallpapers and scripture.</Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 400 }}
          style={styles.shareOptions}
        >
          <View style={styles.optionRow}>
            <ShareItem 
              icon={Share2} 
              label="Share App" 
              onPress={handleShare} 
              color={COLORS.primary} 
            />
            <ShareItem 
              icon={Copy} 
              label="Copy Link" 
              onPress={handleCopyLink} 
              color={COLORS.terracotta} 
            />
          </View>
          
          <View style={[styles.optionRow, { marginTop: 24 }]}>
            <ShareItem 
              icon={MessageCircle} 
              label="WhatsApp" 
              onPress={handleShare} 
              color="#25D366" 
            />
            <ShareItem 
              icon={Mail} 
              label="Email" 
              onPress={handleShare} 
              color={COLORS.warmBrown} 
            />
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 600 }}
          style={styles.linkContainer}
        >
          <View style={styles.linkBox}>
            <Text style={styles.urlText}>{APP_URL}</Text>
            <Pressable onPress={handleCopyLink}>
              <Text bold color="primary">COPY</Text>
            </Pressable>
          </View>
        </MotiView>
      </View>
    </View>
  );
}

const ShareItem = ({ icon: Icon, label, onPress, color }: any) => (
  <Pressable 
    onPress={onPress}
    style={({ pressed }) => [
      styles.shareItem,
      pressed && { scale: 0.95, opacity: 0.8 }
    ]}
  >
    <View style={[styles.shareIconCircle, { backgroundColor: `${color}15` }]}>
      <Icon size={28} color={color} />
    </View>
    <Text bold style={styles.shareLabel}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.softPeach,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.espresso,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  previewCard: {
    width: '100%',
    height: 200,
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    marginBottom: 48,
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgIcon: {
    position: 'absolute',
    right: -20,
    top: -20,
  },
  cardContent: {
    alignItems: 'center',
  },
  appIconPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#FFF',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  appIcon: {
    width: 60,
    height: 60,
  },
  cardTitle: {
    fontSize: 24,
    color: '#FFF',
    letterSpacing: 0.5,
  },
  cardTagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  titleText: {
    fontSize: 28,
    color: COLORS.espresso,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: COLORS.warmBrown,
    textAlign: 'center',
    lineHeight: 24,
  },
  shareOptions: {
    width: '100%',
    marginBottom: 48,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  shareItem: {
    alignItems: 'center',
    width: width / 4,
  },
  shareIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  shareLabel: {
    fontSize: 14,
    color: COLORS.deepTerracotta,
  },
  linkContainer: {
    width: '100%',
  },
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: 'rgba(244, 121, 43, 0.1)',
  },
  urlText: {
    fontSize: 15,
    color: COLORS.warmBrown,
  },
});
