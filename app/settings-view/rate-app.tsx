import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  Star,
  ArrowLeft,
  Heart,
  MessageSquare,
  Send,
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
  gold: '#FFB800',
};

export default function RateAppScreen() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRate = (index: number) => {
    setRating(index);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleBack = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const getRatingMessage = () => {
    if (rating === 0) return "How is your experience?";
    if (rating <= 2) return "We're sorry to hear that. How can we improve?";
    if (rating === 3) return "Glad you're liking it! Any feedback?";
    return "We love you too! Mind sharing a review?";
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
          from={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          style={styles.iconContainer}
        >
          <View style={styles.heartCircle}>
            <Heart size={48} color="#FFF" fill="#FFF" />
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200 }}
          style={styles.textContainer}
        >
          <Text bold style={styles.titleText}>Rate Faith Frames</Text>
          <Text style={styles.subtitleText}>Your feedback helps us spread more faith and inspiration.</Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 400 }}
          style={styles.starsWrapper}
        >
          <Text bold style={styles.ratingMessage}>{getRatingMessage()}</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((index) => (
              <Pressable
                key={index}
                onPress={() => handleRate(index)}
                style={({ pressed }) => [
                  styles.starBtn,
                  pressed && { transform: [{ scale: 0.9 }] }
                ]}
              >
                <MotiView
                  animate={{
                    scale: rating >= index ? 1.2 : 1,
                    rotate: rating >= index ? '360deg' : '0deg',
                  }}
                  transition={{ type: 'spring', damping: 12 }}
                >
                  <Star
                    size={42}
                    color={rating >= index ? COLORS.gold : COLORS.terracotta}
                    fill={rating >= index ? COLORS.gold : 'transparent'}
                    strokeWidth={rating >= index ? 0 : 2}
                  />
                </MotiView>
              </Pressable>
            ))}
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 40 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 600 }}
          style={styles.footer}
        >
          {rating > 0 && (
            <Pressable 
              style={styles.submitBtn}
              onPress={() => {
                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                // In a real app, this would open App Store/Play Store
                router.back();
              }}
            >
              <Send size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text bold style={styles.submitBtnText}>
                {rating >= 4 ? "Rate on Store" : "Submit Feedback"}
              </Text>
            </Pressable>
          )}

          <Pressable 
            style={styles.feedbackBtn}
            onPress={() => { if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
          >
            <MessageSquare size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
            <Text bold style={styles.feedbackBtnText}>Write a Suggestion</Text>
          </Pressable>
        </MotiView>
      </View>
    </View>
  );
}

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
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  iconContainer: {
    marginBottom: 32,
  },
  heartCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
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
  starsWrapper: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 48,
  },
  ratingMessage: {
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  starBtn: {
    padding: 4,
  },
  footer: {
    width: '100%',
    gap: 16,
  },
  submitBtn: {
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
  submitBtnText: {
    color: '#FFF',
    fontSize: 18,
  },
  feedbackBtn: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackBtnText: {
    color: COLORS.primary,
    fontSize: 16,
  },
});
