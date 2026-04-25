import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Share,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../src/utils/firebase';
import { MotiView } from 'moti';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Share2, Hand, Sparkles, Moon } from 'lucide-react-native';
import { AnimatedBackground } from '../../src/components/ui/AnimatedBackground';
import Text from '../../src/components/ui/Text';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';

const ACCENT = '#FFA64D';
const ACCENT_SOFT = 'rgba(255, 166, 77, 0.12)';

interface PrayerData {
  verse: string;
  reference: string;
  bgurl?: string;
  theme?: string;
}

const FALLBACK_PRAYERS: PrayerData[] = [
  {
    verse:
      'Heavenly Father, thank You for this day. Fill my heart with peace, guide my steps, and help me reflect Your love in all I do. Give me wisdom for every decision and courage for every challenge. In Jesus\u2019 name, Amen.',
    reference: 'Philippians 4:6\u20137',
    theme: 'Peace & Guidance',
  },
  {
    verse:
      'Lord, I come before You with a grateful heart. Thank You for Your faithfulness that is new every morning. Help me to trust You in every season, to seek Your face in prayer, and to walk in the light of Your Word. Amen.',
    reference: 'Lamentations 3:22\u201323',
    theme: 'Gratitude & Faith',
  },
  {
    verse:
      'Father, grant me the grace to forgive as You have forgiven me. Heal the wounds I carry, restore what is broken, and fill me with the peace that surpasses all understanding. Amen.',
    reference: 'Colossians 3:13',
    theme: 'Forgiveness & Healing',
  },
];

export default function DailyPrayerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrayer = async () => {
      try {
        if (!db) throw new Error('No DB');
        const snapshot = await getDocs(collection(db, 'dailyprayers'));
        const prayers = snapshot.docs.map((doc) => doc.data() as PrayerData);

        if (prayers.length > 0) {
          const today = new Date();
          const dayOfYear = Math.floor(
            (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
          );
          setPrayerData(prayers[dayOfYear % prayers.length]);
        } else {
          throw new Error('empty');
        }
      } catch {
        const today = new Date();
        const dayOfYear = Math.floor(
          (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
        );
        setPrayerData(FALLBACK_PRAYERS[dayOfYear % FALLBACK_PRAYERS.length]);
      } finally {
        setLoading(false);
      }
    };
    fetchPrayer();
  }, []);

  const handleShare = useCallback(async () => {
    if (!prayerData) return;
    await Share.share({
      message: `${prayerData.verse}\n\n\u2014 ${prayerData.reference}\n\nShared from Faith Frames`,
    });
  }, [prayerData]);

  if (loading) {
    return (
      <View style={styles.loaderScreen}>
        <AnimatedBackground />
        <ActivityIndicator size="large" color={ACCENT} />
      </View>
    );
  }

  const hasBackground = !!prayerData?.bgurl;

  const MainContent = () => (
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
          <Hand size={13} color={ACCENT} strokeWidth={1.5} />
          <Text variant="xs" style={styles.headerLabel}>PRAYER</Text>
        </View>

        <TouchableOpacity onPress={handleShare} style={styles.circleBtn}>
          <BlurView intensity={15} tint="dark" style={styles.blurBtn}>
            <Share2 size={18} color="#fff" strokeWidth={2} />
          </BlurView>
        </TouchableOpacity>
      </MotiView>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme badge */}
        {prayerData?.theme && (
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', delay: 300 }}
            style={styles.themeBadge}
          >
            <Moon size={10} color={ACCENT} />
            <Text style={styles.themeBadgeText}>{prayerData.theme.toUpperCase()}</Text>
          </MotiView>
        )}

        {/* Title */}
        <MotiView
          from={{ opacity: 0, translateY: 15 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 700, delay: 250 }}
          style={styles.titleBlock}
        >
          <Text style={styles.screenTitle}>Daily{'\n'}Prayer</Text>
          <LinearGradient
            colors={[ACCENT, 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.titleLine}
          />
        </MotiView>

        {/* Prayer card */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 450 }}
        >
          <BlurView intensity={hasBackground ? 30 : 8} tint="dark" style={styles.prayerCard}>
            {/* Glow top accent */}
            <LinearGradient
              colors={[ACCENT_SOFT, 'transparent']}
              style={styles.cardTopGlow}
            />

            <View style={styles.prayerIconRow}>
              <View style={styles.prayerIconBg}>
                <Sparkles size={16} color={ACCENT} strokeWidth={1.5} />
              </View>
              <Text style={styles.prayerLabel}>A PRAYER FOR YOU</Text>
            </View>

            <Text style={styles.prayerText}>{prayerData?.verse}</Text>

            {/* Reference */}
            <View style={styles.refRow}>
              <View style={[styles.refDot, { backgroundColor: ACCENT }]} />
              <Text style={styles.refText}>{prayerData?.reference}</Text>
            </View>

            <View style={styles.cardBorder} />
          </BlurView>
        </MotiView>

        {/* Subtle encouragement footer */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 900 }}
          style={styles.footer}
        >
          <Text style={styles.footerText}>"The prayer of a righteous person is powerful."</Text>
          <Text style={styles.footerRef}>JAMES 5:16</Text>
        </MotiView>
      </ScrollView>
    </View>
  );

  if (hasBackground) {
    return (
      <ImageBackground source={{ uri: prayerData!.bgurl }} style={{ flex: 1 }} resizeMode="cover">
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <LinearGradient
          colors={['rgba(5,5,5,0.6)', 'rgba(5,5,5,0.88)', '#050505']}
          style={StyleSheet.absoluteFill}
        />
        <MainContent />
      </ImageBackground>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <AnimatedBackground />
      <MainContent />
    </View>
  );
}

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
    paddingTop: spacing.md,
  },
  themeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,166,77,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,166,77,0.2)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    marginBottom: spacing.md,
  },
  themeBadgeText: {
    color: ACCENT,
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: '700',
  },
  titleBlock: {
    marginBottom: spacing.xl,
  },
  screenTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -2,
    lineHeight: 46,
    marginBottom: spacing.md,
  },
  titleLine: {
    height: 2,
    width: 32,
    borderRadius: 1,
  },
  prayerCard: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.03)',
    overflow: 'hidden',
    marginBottom: spacing.xxl,
  },
  cardTopGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    borderRadius: radius.xl,
  },
  prayerIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.lg,
  },
  prayerIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,166,77,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,166,77,0.2)',
  },
  prayerLabel: {
    fontSize: 9,
    letterSpacing: 2.5,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '700',
  },
  prayerText: {
    fontSize: 17,
    color: '#FFFFFF',
    lineHeight: 30,
    fontStyle: 'italic',
    fontWeight: '500',
    opacity: 0.9,
  },
  refRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.lg,
  },
  refDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  refText: {
    fontSize: 13,
    color: ACCENT,
    fontWeight: '700',
  },
  cardBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.xl,
    pointerEvents: 'none',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
  footerText: {
    fontSize: 12,
    color: '#fff',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 4,
  },
  footerRef: {
    fontSize: 9,
    letterSpacing: 2.5,
    color: ACCENT,
    fontWeight: '700',
  },
});
