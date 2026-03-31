import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WavyCurve } from '../../src/components/ui/WavyCurve';
import Svg, { Path } from 'react-native-svg';
import Text from '../../src/components/ui/Text';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ReelDetailScreen() {
  const { id, title: passedTitle } = useLocalSearchParams();
  const router = useRouter();

  // Mock data matching the provided image EXACTLY
  const reelData = {
    title: (passedTitle as string) || 'Faith Story',
    category: 'Bible',
    duration: '15 min',
    image: require('../../assets/caroselfour.png'), // Default image
    description:
      'A short faith reflection to encourage your heart today. Spend a few moments in scripture, prayer, and gratitude.',
  };

  // Map images based on ID if needed, otherwise use passed title or default
  const getReelImage = () => {
    if (id === 'r1') return require('../../assets/Post de Instagram Versículo de la Biblia  Minimalista Beige.png');
    if (id === 'r2') return require('../../assets/reelo.png');
    if (id === 'r3') return require('../../assets/tempa.png');
    if (id === 'r4') return require('../../assets/ooks.png');
    
    // Stories
    if (id === 'p1') return require('../../assets/caroselfour.png');
    if (id === 'p2') return require('../../assets/caroselfive.png');
    if (id === 'p3') return require('../../assets/caroselsix.png');
    if (id === 'p4') return require('../../assets/caroseltwo.png');
    
    return reelData.image;
  };

  return (
    <View style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* Top Image Section with Convex Bottom */}
        <View style={styles.imageContainer}>
          <Image
            source={getReelImage()}
            style={styles.headerImage}
            contentFit="cover"
          />
          <SafeAreaView style={styles.headerOverlay}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </Pressable>
          </SafeAreaView>
          <WavyCurve width={SCREEN_WIDTH} color="#FFFBEB" />
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          <Animated.View entering={FadeInDown.delay(200)}>
            <Text variant="xl" bold style={styles.title}>
              {(passedTitle as string) || reelData.title}
            </Text>
            <Text variant="sm" style={styles.metadata}>
              Category: {reelData.category} | Duration: {reelData.duration}
            </Text>
          </Animated.View>

          {/* Description Card */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.descriptionCard}>
            <Text variant="sm" style={styles.descriptionText}>
              {reelData.description}
            </Text>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBEB', // Light cream background as in the image
  },
  imageContainer: {
    height: 300,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  backButton: {
    marginLeft: spacing.md,
    marginTop: spacing.sm,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
  title: {
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  metadata: {
    color: '#666666',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  descriptionCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: spacing.xl,
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  descriptionText: {
    color: '#444444',
    lineHeight: 22,
    textAlign: 'center',
  },
});
