import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { collection, onSnapshot, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../src/utils/firebase';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { shadows } from '../../src/theme/shadows';
import Text from '../../src/components/ui/Text';
import Card from '../../src/components/ui/Card';
import { LucideIcon, MessageCircle, ExternalLink, Heart, Clock } from 'lucide-react-native';

interface MeetSession {
  id: string;
  meetLink: string;
  title?: string;
  description?: string;
  likes?: number;
  createdAt?: any;
}

export default function MeetShareScreen() {
  const [sessions, setSessions] = useState<MeetSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;

    const sessionsRef = collection(db, 'meetSessions');
    const q = query(sessionsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MeetSession[];
      setSessions(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching meet sessions:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleReaction = async (id: string, currentValue: number = 0) => {
    try {
      if (!db) return;
      const ref = doc(db, 'meetSessions', id);
      await updateDoc(ref, { likes: currentValue + 1 });
    } catch (err) {
      console.error("Error updating reaction:", err);
    }
  };

  const openLink = (url: string) => {
    if (url && (url.startsWith('http') || url.startsWith('https'))) {
      Linking.openURL(url);
    } else {
      Alert.alert('Invalid Link', 'This meeting link is not valid.');
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
          Meet Sessions
        </Text>
        <Text variant="sm" color="textSecondary">
          Join real-time faith discussions and prayer circles.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {sessions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MessageCircle size={48} color={colors.textSecondary} />
            <Text variant="md" color="textSecondary" style={styles.emptyText}>
              No sessions available right now. Check back later!
            </Text>
          </View>
        ) : (
          sessions.map((session) => (
            <Card key={session.id} elevated style={styles.card}>
              <View style={styles.cardHeader}>
                <Text variant="lg" bold>
                  {session.title || 'Community Meet'}
                </Text>
                {session.createdAt && (
                  <View style={styles.timeRow}>
                    <Clock size={12} color={colors.textSecondary} />
                    <Text variant="xs" color="textSecondary" style={styles.timeText}>
                      {new Date(session.createdAt?.seconds * 1000).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>

              <Text variant="sm" color="textSecondary" style={styles.description}>
                {session.description || 'Join our community for a peaceful session of faith and sharing.'}
              </Text>

              <TouchableOpacity 
                style={styles.linkButton} 
                onPress={() => openLink(session.meetLink)}
              >
                <Text style={styles.linkText} numberOfLines={1}>
                  {session.meetLink}
                </Text>
                <ExternalLink size={16} color={colors.primary} />
              </TouchableOpacity>

              <View style={styles.footer}>
                <TouchableOpacity 
                  style={styles.reactionButton}
                  onPress={() => handleReaction(session.id, session.likes)}
                >
                  <Heart size={20} color={session.likes ? colors.error : colors.textSecondary} fill={session.likes ? colors.error : 'transparent'} />
                  <Text variant="sm" bold style={styles.reactionCount}>
                    {session.likes || 0}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.joinButton}
                  onPress={() => openLink(session.meetLink)}
                >
                  <Text variant="sm" bold style={styles.joinText}>
                    Join Now
                  </Text>
                </TouchableOpacity>
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
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    marginLeft: 2,
  },
  description: {
    marginBottom: spacing.md,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'space-between',
  },
  linkText: {
    color: colors.primary,
    flex: 1,
    marginRight: spacing.sm,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  reactionCount: {
    marginLeft: 4,
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
  },
  joinText: {
    color: colors.background,
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
  },
});
