import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions, StatusBar, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, Hand, BookMarked, Globe, Sparkles, Star } from 'lucide-react-native';
import { MotiView, MotiText } from 'moti';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { LibraryCard, CardVariant } from '../../src/components/composites/LibraryCard';
import { AnimatedBackground } from '../../src/components/ui/AnimatedBackground';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import Text from '../../src/components/ui/Text';

interface CardData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  variant: CardVariant;
  route: string;
}

const CARDS_DATA: CardData[] = [
  {
    id: 'daily-verse',
    title: 'Daily Verse',
    subtitle: 'Scripture',
    description: 'Divine wisdom and light for your path',
    icon: BookOpen,
    variant: 'verse',
    route: 'library/daily-verse',
  },
  {
    id: 'daily-prayer',
    title: 'Daily Prayer',
    subtitle: 'Connection',
    description: 'A quiet space for your conversation with God',
    icon: Hand,
    variant: 'prayer',
    route: 'library/daily-prayer',
  },
  {
    id: 'gods-words',
    title: "God's Words",
    subtitle: 'Wisdom',
    description: 'Timeless truths extracted for daily life',
    icon: BookMarked,
    variant: 'wisdom',
    route: 'library/gods-words',
  },
  {
    id: 'witness',
    title: 'The Witness',
    subtitle: 'Stories',
    description: 'Real faith stories from the community',
    icon: Globe,
    variant: 'testimony',
    route: 'library/witness',
  },
];

const WISDOM_DATA = [
  { id: '1', text: 'Trust in the Lord with all your heart.', ref: 'Prov 3:5', color: '#FF7D33' },
  { id: '2', text: 'Your word is a lamp to my feet.', ref: 'Psalm 119:105', color: '#FFA64D' },
  { id: '3', text: 'Faith is being sure of what we hope for.', ref: 'Heb 11:1', color: '#FFB450' },
];

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
};

export default function LibraryScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const greeting = useMemo(() => getGreeting(), []);

  const columnWidth = useMemo(() => {
    const padding = spacing.lg * 2;
    const gap = spacing.sm * 2;
    const availableWidth = width - padding;
    return (availableWidth - gap) / 2;
  }, [width]);

  const handleCardPress = useCallback(
    (route: string) => {
      router.push(route);
    },
    [router]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <AnimatedBackground />

      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Minimalist Header with Staggered Reveal */}
        <View style={styles.header}>
          <MotiText
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 0.4, translateY: 0 }}
            transition={{ type: 'timing', duration: 800, delay: 200 }}
            style={[styles.greetingLabel, { fontSize: 10, fontWeight: '700' }]}
          >
            {greeting.toUpperCase()}
          </MotiText>
          <MotiText
            from={{ opacity: 0, translateY: 15 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 800, delay: 350 }}
            style={styles.title}
          >
            Library
          </MotiText>
          <MotiView
            from={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 600 }}
            style={styles.headerLine}
          />
        </View>

        {/* Daily Wisdom Horizontal Section */}
        <MotiView
          from={{ opacity: 0, translateX: 20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 500 }}
          style={styles.wisdomSection}
        >
          <View style={styles.sectionHeader}>
            <Sparkles size={14} color={colors.accent} />
            <Text variant="xs" bold style={styles.sectionTitle}>DAILY WISDOM</Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.wisdomScroll}
          >
            {WISDOM_DATA.map((item) => (
              <BlurView key={item.id} intensity={8} tint="dark" style={styles.wisdomCard}>
                <Text variant="xs" style={styles.wisdomText}>{item.text}</Text>
                <View style={styles.wisdomFooter}>
                  <Star size={10} color={item.color} fill={item.color} style={{ opacity: 0.5 }} />
                  <Text variant="xs" style={[styles.wisdomRef, { color: item.color }]}>{item.ref}</Text>
                </View>
                <View style={styles.wisdomBorder} />
              </BlurView>
            ))}
          </ScrollView>
        </MotiView>

        {/* Clean 2x2 Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            {CARDS_DATA.slice(0, 2).map((item, index) => (
              <View key={item.id} style={{ width: columnWidth }}>
                <LibraryCard
                  title={item.title}
                  subtitle={item.subtitle}
                  description={item.description}
                  icon={item.icon}
                  variant={item.variant}
                  onPress={() => handleCardPress(item.route)}
                  delay={700 + index * 100}
                />
              </View>
            ))}
          </View>
          <View style={styles.gridRow}>
            {CARDS_DATA.slice(2, 4).map((item, index) => (
              <View key={item.id} style={{ width: columnWidth }}>
                <LibraryCard
                  title={item.title}
                  subtitle={item.subtitle}
                  description={item.description}
                  icon={item.icon}
                  variant={item.variant}
                  onPress={() => handleCardPress(item.route)}
                  delay={900 + index * 100}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Subtle Quote Footer */}
        <MotiView 
          from={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1200 }}
          style={styles.footer}
        >
          <Text variant="xs" color="textSecondary" style={styles.quoteText}>
            "Be still, and know that I am God."
          </Text>
          <Text variant="xs" color="textSecondary" style={styles.quoteRef}>
            PSALM 46:10
          </Text>
        </MotiView>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  greetingLabel: {
    letterSpacing: 3,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '700',
    letterSpacing: -1.5,
  },
  headerLine: {
    width: 24,
    height: 2,
    backgroundColor: colors.accent,
    marginTop: 10,
    borderRadius: 1,
    transformOrigin: 'left',
  },
  wisdomSection: {
    marginBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.md,
    opacity: 0.6,
  },
  sectionTitle: {
    fontSize: 10,
    letterSpacing: 2,
    color: '#FFFFFF',
  },
  wisdomScroll: {
    gap: spacing.md,
  },
  wisdomCard: {
    width: 220,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    overflow: 'hidden',
    justifyContent: 'space-between',
    height: 100,
  },
  wisdomText: {
    color: '#FFFFFF',
    opacity: 0.8,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  wisdomFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wisdomRef: {
    fontSize: 10,
    fontWeight: '700',
    opacity: 0.8,
  },
  wisdomBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: radius.lg,
    pointerEvents: 'none',
  },
  gridContainer: {
    gap: spacing.sm,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    marginTop: spacing.xxxl,
    alignItems: 'center',
  },
  quoteText: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 4,
    fontSize: 11,
  },
  quoteRef: {
    letterSpacing: 2,
    fontWeight: '700',
    fontSize: 9,
  },
});