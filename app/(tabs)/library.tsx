import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { shadows } from '../../src/theme/shadows';
import Card from '../../src/components/ui/Card';
import Text from '../../src/components/ui/Text';

export default function LibraryScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text variant="sm" color="textSecondary">
          Daily Verse
        </Text>
        <TouchableOpacity onPress={() => router.push('/library/daily-verse')}>
          <Card elevated style={styles.largeCard}>
            <Text variant="lg" bold>
              “Be still, and know that I am God.”
            </Text>
            <Text variant="sm" color="textSecondary" style={styles.mtSm}>
              Psalm 46:10
            </Text>
          </Card>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text variant="sm" color="textSecondary">
          Daily Prayer
        </Text>
        <TouchableOpacity onPress={() => router.push('/library/daily-prayer')}>
          <Card style={styles.mediumCard}>
            <Text variant="sm" color="textSecondary">
              A gentle, guided prayer to start or end your day with peace.
            </Text>
          </Card>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionRow}>
        <View style={styles.half}>
          <Text variant="sm" color="textSecondary">
            Wallpapers
          </Text>
          <TouchableOpacity onPress={() => router.push('/library/wallpapers')}>
            <Card elevated style={styles.smallCard}>
              <Text variant="sm" bold>
                Scripture Wallpapers
              </Text>
              <Text variant="xs" color="textSecondary" style={styles.mtXs}>
                Browse all your saved and downloaded wallpapers.
              </Text>
            </Card>
          </TouchableOpacity>
        </View>
        <View style={styles.half}>
          <Text variant="sm" color="textSecondary">
            Prayer Room
          </Text>
          <TouchableOpacity onPress={() => router.push('/library/prayer-room')}>
            <Card elevated style={styles.smallCard}>
              <Text variant="sm" bold>
                Quiet Space
              </Text>
              <Text variant="xs" color="textSecondary" style={styles.mtXs}>
                A calm place for reflections, notes, and prayers.
              </Text>
            </Card>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 120,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  largeCard: {
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    ...shadows.md,
  },
  mediumCard: {
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  smallCard: {
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  half: {
    flex: 1,
  },
  mtSm: {
    marginTop: spacing.sm,
  },
  mtXs: {
    marginTop: spacing.xs,
  },
});