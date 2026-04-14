import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../src/utils/firebase';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { shadows } from '../../src/theme/shadows';
import Text from '../../src/components/ui/Text';
import Card from '../../src/components/ui/Card';
import { useRouter } from 'expo-router';
import { BookOpen, Clock, ChevronRight, Sparkles } from 'lucide-react-native';

interface StudyPlan {
  id: string;
  title: string;
  description: string;
  image: string;
  duration?: string;
}

export default function GodsWordsScreen() {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        if (!db) return;
        const plansRef = collection(db, 'studyPlans');
        const snapshot = await getDocs(plansRef);
        const fetchedPlans = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as StudyPlan[];
        setPlans(fetchedPlans);
      } catch (error) {
        console.error("Error fetching study plans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

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
          God's Words
        </Text>
        <Text variant="sm" color="textSecondary">
          Deep spiritual insights and divine study plans.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {plans.length === 0 ? (
          <View style={styles.emptyContainer}>
            <BookOpen size={48} color={colors.textSecondary} />
            <Text variant="md" color="textSecondary" style={styles.emptyText}>
              No study plans available yet.
            </Text>
          </View>
        ) : (
          plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              activeOpacity={0.9}
              onPress={() => router.push({
                pathname: `/reel/${plan.id}`, // Reusing reel view for detail
                params: { 
                  title: plan.title,
                  description: plan.description,
                  image: plan.image 
                }
              })}
            >
              <Card elevated style={styles.card}>
                <ImageBackground
                  source={{ uri: plan.image }}
                  style={styles.image}
                  imageStyle={styles.imageStyle}
                >
                  <View style={styles.overlay}>
                    <View style={styles.badge}>
                      <Sparkles size={12} color={colors.primary} />
                      <Text variant="xs" bold style={styles.badgeText}>
                        Divine Insight
                      </Text>
                    </View>
                    
                    <View style={styles.cardContent}>
                      <Text variant="lg" bold style={styles.planTitle}>
                        {plan.title}
                      </Text>
                      
                      <View style={styles.metaRow}>
                        {plan.duration && (
                          <View style={styles.metaItem}>
                            <Clock size={14} color={colors.white} />
                            <Text variant="xs" style={styles.metaText}>
                              {plan.duration}
                            </Text>
                          </View>
                        )}
                        <View style={styles.metaItem}>
                          <BookOpen size={14} color={colors.white} />
                          <Text variant="xs" style={styles.metaText}>
                            Study Plan
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </Card>
            </TouchableOpacity>
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
    height: 220,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    borderRadius: radius.lg,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radius.full,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  badgeText: {
    color: colors.primary,
  },
  cardContent: {
    marginTop: 'auto',
  },
  planTitle: {
    color: colors.white,
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: colors.white,
    opacity: 0.9,
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
