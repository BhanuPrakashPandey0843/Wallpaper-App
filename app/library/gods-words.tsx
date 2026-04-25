import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../src/utils/firebase';
import { MotiView } from 'moti';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, BookMarked, Clock, ChevronRight, Sparkles } from 'lucide-react-native';
import { AnimatedBackground } from '../../src/components/ui/AnimatedBackground';
import Text from '../../src/components/ui/Text';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';

const { width } = Dimensions.get('window');
const ACCENT = '#FFB450';
const ACCENT_SOFT = 'rgba(255, 180, 80, 0.12)';

interface StudyPlan {
  id: string;
  title: string;
  description: string;
  image?: string;
  duration?: string;
  category?: string;
}

const FALLBACK_PLANS: StudyPlan[] = [
  {
    id: '1',
    title: 'The Sermon on the Mount',
    description: 'Dive deep into the teachings of Jesus and discover the Kingdom principles that transform everyday life.',
    duration: '7 Days',
    category: 'Teachings of Jesus',
  },
  {
    id: '2',
    title: 'Psalms of Praise',
    description: 'Journey through David\u2019s heartfelt praise and lament, and learn to worship God in every season.',
    duration: '5 Days',
    category: 'Worship',
  },
  {
    id: '3',
    title: 'Walking by Faith',
    description: 'Explore what it truly means to trust God in the unseen, drawing from the great faith chapter of Hebrews 11.',
    duration: '3 Days',
    category: 'Faith',
  },
];

export default function GodsWordsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        if (!db) throw new Error('No DB');
        const snapshot = await getDocs(collection(db, 'studyPlans'));
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as StudyPlan[];
        setPlans(fetched.length > 0 ? fetched : FALLBACK_PLANS);
      } catch {
        setPlans(FALLBACK_PLANS);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderScreen}>
        <AnimatedBackground />
        <ActivityIndicator size="large" color={ACCENT} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <AnimatedBackground />

      <View style={[styles.root, { paddingTop: insets.top }]}>
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600 }}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.circleBtn}>
            <BlurView intensity={15} tint="dark" style={styles.blurBtn}>
              <ArrowLeft size={20} color="#fff" strokeWidth={2} />
            </BlurView>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <BookMarked size={13} color={ACCENT} strokeWidth={1.5} />
            <Text variant="xs" style={styles.headerLabel}>WISDOM</Text>
          </View>

          <View style={{ width: 42 }} />
        </MotiView>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: insets.bottom + 120 },
          ]}
        >
          {/* Title */}
          <MotiView
            from={{ opacity: 0, translateY: 15 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 700, delay: 200 }}
            style={styles.titleBlock}
          >
            <Text style={styles.screenTitle}>{"God's\nWords"}</Text>
            <LinearGradient
              colors={[ACCENT, 'transparent']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.titleLine}
            />
            <Text style={styles.screenSubtitle}>
              Timeless truths and guided study plans for deeper faith.
            </Text>
          </MotiView>

          {/* Cards */}
          {plans.map((plan, index) => (
            <MotiView
              key={plan.id}
              from={{ opacity: 0, translateY: 25 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 700, delay: 350 + index * 120 }}
              style={styles.cardWrap}
            >
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() =>
                  router.push({
                    pathname: `/reel/${plan.id}`,
                    params: {
                      title: plan.title,
                      description: plan.description,
                      image: plan.image ?? '',
                    },
                  })
                }
              >
                {plan.image ? (
                  <ImageBackground
                    source={{ uri: plan.image }}
                    style={styles.cardImageBg}
                    imageStyle={styles.cardImageStyle}
                  >
                    <LinearGradient
                      colors={['rgba(5,5,5,0.15)', 'rgba(5,5,5,0.92)']}
                      style={styles.cardOverlay}
                    >
                      <PlanCardContent plan={plan} accent={ACCENT} />
                    </LinearGradient>
                  </ImageBackground>
                ) : (
                  <BlurView intensity={8} tint="dark" style={styles.cardNoImage}>
                    <LinearGradient
                      colors={[ACCENT_SOFT, 'transparent']}
                      style={styles.cardTopGlow}
                    />
                    <PlanCardContent plan={plan} accent={ACCENT} />
                    <View style={styles.cardBorder} />
                  </BlurView>
                )}
              </TouchableOpacity>
            </MotiView>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

function PlanCardContent({ plan, accent }: { plan: StudyPlan; accent: string }) {
  return (
    <View style={planStyles.content}>
      <View style={planStyles.topRow}>
        {plan.category && (
          <View style={[planStyles.badge, { borderColor: `${accent}40` }]}>
            <Sparkles size={10} color={accent} />
            <Text style={[planStyles.badgeText, { color: accent }]}>{plan.category.toUpperCase()}</Text>
          </View>
        )}
      </View>

      <View style={planStyles.bottom}>
        <Text style={planStyles.title}>{plan.title}</Text>
        {plan.description ? (
          <Text style={planStyles.desc} numberOfLines={2}>{plan.description}</Text>
        ) : null}

        <View style={planStyles.footer}>
          {plan.duration && (
            <View style={planStyles.durationRow}>
              <Clock size={12} color="rgba(255,255,255,0.5)" />
              <Text style={planStyles.durationText}>{plan.duration}</Text>
            </View>
          )}
          <View style={planStyles.readRow}>
            <Text style={[planStyles.readText, { color: accent }]}>Read Plan</Text>
            <ChevronRight size={14} color={accent} />
          </View>
        </View>
      </View>
    </View>
  );
}

const planStyles = StyleSheet.create({
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
    minHeight: 180,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  bottom: {
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  desc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 19,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
  },
  readRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  readText: {
    fontSize: 13,
    fontWeight: '700',
  },
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  loaderScreen: {
    flex: 1,
    backgroundColor: '#050505',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
  },
  blurBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    opacity: 0.6,
  },
  headerLabel: {
    letterSpacing: 2.5,
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  titleBlock: {
    marginBottom: spacing.xl,
  },
  screenTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -2,
    lineHeight: 44,
    marginBottom: spacing.md,
  },
  titleLine: {
    height: 2,
    width: 32,
    borderRadius: 1,
    marginBottom: spacing.md,
  },
  screenSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 20,
  },
  cardWrap: {
    marginBottom: spacing.lg,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  cardImageBg: {
    width: '100%',
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  cardImageStyle: {
    borderRadius: radius.xl,
  },
  cardOverlay: {
    borderRadius: radius.xl,
  },
  cardNoImage: {
    borderRadius: radius.xl,
    backgroundColor: 'rgba(255,255,255,0.025)',
    overflow: 'hidden',
  },
  cardTopGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 70,
  },
  cardBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: radius.xl,
    pointerEvents: 'none',
  },
});
