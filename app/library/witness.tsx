import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../src/utils/firebase';
import { MotiView } from 'moti';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Globe, Heart, Share2, MessageSquare, Quote, User } from 'lucide-react-native';
import { AnimatedBackground } from '../../src/components/ui/AnimatedBackground';
import Text from '../../src/components/ui/Text';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';

const ACCENT = '#FF8C46';
const ACCENT_SOFT = 'rgba(255, 140, 70, 0.12)';

interface WitnessPost {
  id: string;
  title: string;
  message: string;
  imageUrl?: string;
  likes?: number;
  author?: string;
  createdAt?: any;
}

const FALLBACK_POSTS: WitnessPost[] = [
  {
    id: '1',
    title: 'He Never Left My Side',
    message:
      'I was going through the darkest season of my life — I had lost my job, my father was ill, and I felt completely alone. One night I cried out to God with nothing left to say, and I felt a peace wash over me that I cannot explain. He was there all along, waiting for me to be still enough to hear Him.',
    author: 'Grace M.',
    likes: 47,
  },
  {
    id: '2',
    title: 'A Prayer Answered After 10 Years',
    message:
      'For a decade I prayed for my brother\'s heart to turn back to God. Last Sunday he walked into church, sat beside me, and gave his life to Christ. I wept the entire service. Do not give up on your prayers. God\'s timing is always perfect.',
    author: 'Samuel O.',
    likes: 83,
  },
  {
    id: '3',
    title: 'Provision in the Wilderness',
    message:
      'We were three months behind on rent with no income in sight. I remember reading about Elijah in the wilderness and how God sent ravens to feed him. That same week, an anonymous envelope was slipped under our door with exactly the amount we needed. God is Jehovah Jireh.',
    author: 'Ruth A.',
    likes: 62,
  },
];

export default function WitnessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<WitnessPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!db) {
      setPosts(FALLBACK_POSTS);
      setLoading(false);
      return;
    }

    const postsRef = collection(db, 'witnessPosts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as WitnessPost[];
        setPosts(fetched.length > 0 ? fetched : FALLBACK_POSTS);
        setLoading(false);
      },
      () => {
        setPosts(FALLBACK_POSTS);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleLike = useCallback(
    async (postId: string, currentLikes: number = 0) => {
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (next.has(postId)) {
          next.delete(postId);
        } else {
          next.add(postId);
        }
        return next;
      });

      // Optimistic Firestore update
      try {
        if (db) {
          const postRef = doc(db, 'witnessPosts', postId);
          await updateDoc(postRef, {
            likes: likedIds.has(postId) ? Math.max(0, currentLikes - 1) : currentLikes + 1,
          });
        }
      } catch {
        // Firestore update failed silently — UI already toggled
      }
    },
    [likedIds]
  );

  const handleShare = useCallback(async (post: WitnessPost) => {
    await Share.share({
      message: `"${post.title}"\n\n${post.message}\n\n— ${post.author ?? 'Anonymous'}\n\nShared from Faith Frames`,
    });
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
            <Globe size={13} color={ACCENT} strokeWidth={1.5} />
            <Text variant="xs" style={styles.headerLabel}>STORIES</Text>
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
          {/* Title block */}
          <MotiView
            from={{ opacity: 0, translateY: 15 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 700, delay: 200 }}
            style={styles.titleBlock}
          >
            <Text style={styles.screenTitle}>{'The\nWitness'}</Text>
            <LinearGradient
              colors={[ACCENT, 'transparent']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.titleLine}
            />
            <Text style={styles.screenSubtitle}>
              Real stories of faith, transformation, and God's faithfulness.
            </Text>
          </MotiView>

          {/* Post cards */}
          {posts.map((post, index) => {
            const isLiked = likedIds.has(post.id);
            const likeCount = (post.likes ?? 0) + (isLiked && !(post.likes) ? 1 : 0);

            return (
              <MotiView
                key={post.id}
                from={{ opacity: 0, translateY: 28 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 700, delay: 350 + index * 130 }}
                style={styles.cardWrap}
              >
                <BlurView intensity={8} tint="dark" style={styles.card}>
                  {/* Top accent glow */}
                  <LinearGradient
                    colors={[ACCENT_SOFT, 'transparent']}
                    style={styles.cardTopGlow}
                  />

                  {/* Post image */}
                  {post.imageUrl ? (
                    <Image
                      source={{ uri: post.imageUrl }}
                      style={styles.postImage}
                      resizeMode="cover"
                    />
                  ) : null}

                  <View style={styles.cardBody}>
                    {/* Quote icon + title */}
                    <View style={styles.titleRow}>
                      <View style={styles.quoteIconBg}>
                        <Quote size={14} color={ACCENT} strokeWidth={2} />
                      </View>
                      <Text style={styles.postTitle} numberOfLines={2}>
                        {post.title}
                      </Text>
                    </View>

                    {/* Message */}
                    <Text style={styles.postMessage}>{post.message}</Text>

                    {/* Author row */}
                    {post.author && (
                      <View style={styles.authorRow}>
                        <View style={styles.authorAvatar}>
                          <User size={12} color={ACCENT} strokeWidth={2} />
                        </View>
                        <Text style={styles.authorText}>Shared by {post.author}</Text>
                      </View>
                    )}

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Actions */}
                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => handleLike(post.id, post.likes)}
                        activeOpacity={0.7}
                      >
                        <Heart
                          size={18}
                          color={isLiked ? '#FF4B6E' : 'rgba(255,255,255,0.35)'}
                          fill={isLiked ? '#FF4B6E' : 'transparent'}
                          strokeWidth={2}
                        />
                        <Text
                          style={[
                            styles.actionText,
                            isLiked && { color: '#FF4B6E' },
                          ]}
                        >
                          {likeCount > 0 ? likeCount : 'Like'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => handleShare(post)}
                        activeOpacity={0.7}
                      >
                        <Share2 size={18} color="rgba(255,255,255,0.35)" strokeWidth={2} />
                        <Text style={styles.actionText}>Share</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Card border */}
                  <View style={styles.cardBorder} />
                </BlurView>
              </MotiView>
            );
          })}

          {/* Footer encouragement */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ delay: 1000 }}
            style={styles.footer}
          >
            <MessageSquare size={14} color="rgba(255,255,255,0.3)" />
            <Text style={styles.footerText}>
              Your story matters. Every testimony strengthens the body of Christ.
            </Text>
          </MotiView>
        </ScrollView>
      </View>
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
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 20,
  },
  cardWrap: {
    marginBottom: spacing.lg,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  card: {
    borderRadius: radius.xl,
    backgroundColor: 'rgba(255,255,255,0.025)',
    overflow: 'hidden',
  },
  cardTopGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    borderRadius: radius.xl,
    pointerEvents: 'none',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  cardBody: {
    padding: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: spacing.md,
  },
  quoteIconBg: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,140,70,0.2)',
    marginTop: 2,
    flexShrink: 0,
  },
  postTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    lineHeight: 24,
  },
  postMessage: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.md,
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,140,70,0.2)',
  },
  authorText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
    fontWeight: '600',
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
    paddingVertical: spacing.xl,
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
