import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Share,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../src/utils/firebase';
import { MotiView, MotiText } from 'moti';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Heart, Share2, BookOpen, Star } from 'lucide-react-native';
import { AnimatedBackground } from '../../src/components/ui/AnimatedBackground';
import Text from '../../src/components/ui/Text';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';

const { width, height } = Dimensions.get('window');

const ACCENT = '#FF7D33';
const ACCENT_SOFT = 'rgba(255, 125, 51, 0.15)';

interface VerseData {
  verse: string;
  reference: string;
  bgurl?: string;
  reflection?: string;
}

// Fallback verses if Firestore is empty
const FALLBACK_VERSES: VerseData[] = [
  {
    verse: 'Be still, and know that I am God.',
    reference: 'Psalm 46:10',
    reflection: 'In silence and trust, God reveals His presence and power.',
  },
  {
    verse: 'I can do all things through Christ who strengthens me.',
    reference: 'Philippians 4:13',
    reflection: 'Your strength comes not from yourself, but from the One who created you.',
  },
  {
    verse: 'The Lord is my shepherd; I shall not want.',
    reference: 'Psalm 23:1',
    reflection: 'Under His care, every need of your soul is met with perfect love.',
  },
];

export default function DailyVerseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [verseData, setVerseData] = useState<VerseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchVerse = async () => {
      try {
        if (!db) throw new Error('No DB');
        const snapshot = await getDocs(collection(db, 'dailyVerses'));
        const verses = snapshot.docs.map((doc) => doc.data() as VerseData);

        if (verses.length > 0) {
          const today = new Date();
          const dayOfYear = Math.floor(
            (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
          );
          setVerseData(verses[dayOfYear % verses.length]);
        } else {
          throw new Error('empty');
        }
      } catch {
        const today = new Date();
        const dayOfYear = Math.floor(
          (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
        );
        setVerseData(FALLBACK_VERSES[dayOfYear % FALLBACK_VERSES.length]);
      } finally {
        setLoading(false);
      }
    };
    fetchVerse();
  }, []);

  const handleShare = useCallback(async () => {
    if (!verseData) return;
    await Share.share({
      message: `"${verseData.verse}" — ${verseData.reference}\n\nShared from Faith Frames`,
    });
  }, [verseData]);

  if (loading) {
    return (
      <View style={styles.loaderScreen}>
        <AnimatedBackground />
        <ActivityIndicator size="large" color={ACCENT} />
      </View>
    );
  }

  const hasBackground = !!verseData?.bgurl;

  const MainContent = () => (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <BlurView intensity={15} tint="dark" style={styles.backBlur}>
            <ArrowLeft size={20} color="#fff" strokeWidth={2} />
          </BlurView>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <BookOpen size={14} color={ACCENT} strokeWidth={1.5} />
          <Text variant="xs" style={styles.headerLabel}>SCRIPTURE</Text>
        </View>

        <TouchableOpacity onPress={handleShare} style={styles.backBtn}>
          <BlurView intensity={15} tint="dark" style={styles.backBlur}>
            <Share2 size={18} color="#fff" strokeWidth={2} />
          </BlurView>
        </TouchableOpacity>
      </MotiView>

      {/* Main verse card - centered on screen */}
      <View style={styles.centerContent}>
        {/* Floating label */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', delay: 300 }}
          style={styles.dayBadge}
        >
          <Star size={10} color={ACCENT} fill={ACCENT} />
          <Text variant="xs" style={styles.dayBadgeText}>DAILY VERSE</Text>
        </MotiView>

        {/* Verse text */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 400 }}
        >
          <BlurView intensity={hasBackground ? 30 : 8} tint="dark" style={styles.verseCard}>
            {/* Accent line */}
            <LinearGradient
              colors={[ACCENT, 'transparent']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.accentLine}
            />

            <Text style={styles.quoteSymbol}>"</Text>
            <Text style={styles.verseText}>{verseData?.verse}</Text>
            <Text style={styles.quoteSymbolClose}>"</Text>

            {/* Reference */}
            <View style={styles.referenceRow}>
              <View style={[styles.refDot, { backgroundColor: ACCENT }]} />
              <Text style={styles.referenceText}>{verseData?.reference}</Text>
            </View>

            {/* Reflection */}
            {verseData?.reflection && (
              <View style={styles.reflectionBox}>
                <Text style={styles.reflectionLabel}>REFLECTION</Text>
                <Text style={styles.reflectionText}>{verseData.reflection}</Text>
              </View>
            )}

            {/* Border glow */}
            <View style={styles.cardBorder} />
          </BlurView>
        </MotiView>
      </View>

      {/* Bottom actions */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 700, delay: 700 }}
        style={[styles.bottomActions, { paddingBottom: insets.bottom + spacing.lg }]}
      >
        <TouchableOpacity
          style={[styles.actionBtn, liked && styles.actionBtnActive]}
          onPress={() => setLiked((p) => !p)}
        >
          <Heart
            size={20}
            color={liked ? '#FF4B6E' : 'rgba(255,255,255,0.5)'}
            fill={liked ? '#FF4B6E' : 'transparent'}
            strokeWidth={2}
          />
          <Text style={[styles.actionBtnText, liked && { color: '#FF4B6E' }]}>
            {liked ? 'Saved' : 'Save'}
          </Text>
        </TouchableOpacity>

        <View style={styles.actionDivider} />

        <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
          <Share2 size={20} color="rgba(255,255,255,0.5)" strokeWidth={2} />
          <Text style={styles.actionBtnText}>Share</Text>
        </TouchableOpacity>
      </MotiView>
    </View>
  );

  if (hasBackground) {
    return (
      <ImageBackground source={{ uri: verseData!.bgurl }} style={{ flex: 1 }} resizeMode="cover">
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <LinearGradient
          colors={['rgba(5,5,5,0.55)', 'rgba(5,5,5,0.85)', 'rgba(5,5,5,0.97)']}
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
  root: {
    flex: 1,
  },
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
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
  },
  backBlur: {
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  dayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'center',
    backgroundColor: ACCENT_SOFT,
    borderWidth: 1,
    borderColor: 'rgba(255,125,51,0.25)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    marginBottom: spacing.lg,
  },
  dayBadgeText: {
    color: ACCENT,
    letterSpacing: 2,
    fontWeight: '700',
    fontSize: 10,
  },
  verseCard: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.03)',
    overflow: 'hidden',
  },
  accentLine: {
    height: 1.5,
    width: 40,
    marginBottom: spacing.lg,
    borderRadius: 1,
  },
  quoteSymbol: {
    fontSize: 64,
    color: ACCENT,
    opacity: 0.25,
    lineHeight: 50,
    fontWeight: '900',
    marginBottom: -spacing.sm,
  },
  quoteSymbolClose: {
    fontSize: 64,
    color: ACCENT,
    opacity: 0.25,
    lineHeight: 50,
    fontWeight: '900',
    textAlign: 'right',
    marginTop: -spacing.sm,
  },
  verseText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: -0.3,
    paddingHorizontal: spacing.sm,
  },
  referenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  refDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  referenceText: {
    fontSize: 14,
    color: ACCENT,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  reflectionBox: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: spacing.md,
    marginTop: spacing.sm,
  },
  reflectionLabel: {
    fontSize: 9,
    letterSpacing: 2.5,
    color: 'rgba(255,255,255,0.35)',
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  reflectionText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  cardBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.xl,
    pointerEvents: 'none',
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    gap: 0,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: spacing.md,
  },
  actionBtnActive: {},
  actionBtnText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  actionDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});
