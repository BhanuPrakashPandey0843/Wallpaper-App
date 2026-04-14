import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../src/utils/firebase';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { shadows } from '../../src/theme/shadows';
import Text from '../../src/components/ui/Text';
import Card from '../../src/components/ui/Card';
import { LucideIcon, Heart, Share2, MessageSquare, Quote } from 'lucide-react-native';

interface WitnessPost {
  id: string;
  title: string;
  message: string;
  imageUrl?: string;
  likes?: number;
  author?: string;
  createdAt?: any;
}

export default function WitnessScreen() {
  const [posts, setPosts] = useState<WitnessPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;

    const postsRef = collection(db, 'witnessPosts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as WitnessPost[];
      setPosts(fetchedPosts);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching witness posts:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = async (postId: string, currentLikes: number = 0) => {
    try {
      if (!db) return;
      const postRef = doc(db, 'witnessPosts', postId);
      await updateDoc(postRef, {
        likes: currentLikes + 1,
      });
    } catch (err) {
      console.error("Error updating like:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="xl" bold style={styles.title}>
          The Witness
        </Text>
        <Text variant="sm" color="textSecondary">
          Sharing personal faith journeys and miracles.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {posts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Quote size={48} color={colors.textSecondary} />
            <Text variant="md" color="textSecondary" style={styles.emptyText}>
              No testimonies shared yet. Be the first to share your story!
            </Text>
          </View>
        ) : (
          posts.map((post) => (
            <Card key={post.id} elevated style={styles.card}>
              {post.imageUrl && (
                <Image
                  source={{ uri: post.imageUrl }}
                  style={styles.postImage}
                  resizeMode="cover"
                />
              )}
              
              <View style={styles.contentSection}>
                <View style={styles.titleRow}>
                  <Quote size={16} color={colors.primary} />
                  <Text variant="lg" bold style={styles.postTitle}>
                    {post.title}
                  </Text>
                </View>
                
                <Text variant="md" color="textPrimary" style={styles.message}>
                  {post.message}
                </Text>

                {post.author && (
                  <Text variant="xs" color="textSecondary" style={styles.author}>
                    — Shared by {post.author}
                  </Text>
                )}

                <View style={styles.actions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleLike(post.id, post.likes)}
                  >
                    <Heart size={20} color={post.likes ? colors.error : colors.textSecondary} fill={post.likes ? colors.error : 'transparent'} />
                    <Text variant="sm" bold style={styles.actionCount}>
                      {post.likes || 0}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton}>
                    <Share2 size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    marginBottom: spacing.xs,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  card: {
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
    overflow: 'hidden',
    padding: 0,
  },
  postImage: {
    width: '100%',
    height: 200,
  },
  contentSection: {
    padding: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  postTitle: {
    flex: 1,
  },
  message: {
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  author: {
    fontStyle: 'italic',
    marginBottom: spacing.md,
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionCount: {
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl * 2,
    opacity: 0.6,
  },
  emptyText: {
    marginTop: spacing.md,
    textAlign: 'center',
    maxWidth: '80%',
  },
});
