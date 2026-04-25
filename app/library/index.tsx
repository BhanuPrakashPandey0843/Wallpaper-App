import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, Hand, BookMarked, Globe } from 'lucide-react-native';
import LibraryCard, { CardVariant } from '../../src/components/composites/LibraryCard';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

interface CardData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<any>;
  variant: CardVariant;
  route: string;
}

const CARDS_DATA: CardData[] = [
  {
    id: 'daily-verse',
    title: 'Daily Verse',
    subtitle: 'Scripture of the day',
    description: 'Start your day with divine wisdom',
    icon: BookOpen,
    variant: 'verse',
    route: 'library/daily-verse',
  },
  {
    id: 'daily-prayer',
    title: 'Daily Prayer',
    subtitle: 'Moment of connection',
    description: 'A sacred space for prayer & reflection',
    icon: Hand,
    variant: 'prayer',
    route: 'library/daily-prayer',
  },
  {
    id: 'gods-words',
    title: "God's Words",
    subtitle: 'Wisdom & guidance',
    description: 'Timeless truths from Scripture',
    icon: BookMarked,
    variant: 'wisdom',
    route: 'library/gods-words',
  },
  {
    id: 'witness',
    title: 'The Witness',
    subtitle: 'Testimonies & stories',
    description: 'Real stories of faith & transformation',
    icon: Globe,
    variant: 'testimony',
    route: 'library/witness',
  },
];

export default function LibraryScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  // Calculate column width for proper square aspect ratio
  const columnWidth = useMemo(() => {
    const padding = spacing.md * 2; // Left and right padding
    const gap = spacing.md; // Gap between columns
    const availableWidth = width - padding;
    return (availableWidth - gap) / 2;
  }, [width]);

  const handleCardPress = useCallback(
    (route: string) => {
      router.push(route);
    },
    [router]
  );

  const renderCard = useCallback(
    ({ item, index }: { item: CardData; index: number }) => (
      <View style={{ width: columnWidth }}>
        <LibraryCard
          title={item.title}
          subtitle={item.subtitle}
          description={item.description}
          icon={item.icon}
          variant={item.variant}
          onPress={() => handleCardPress(item.route)}
          delay={index * 100}
        />
      </View>
    ),
    [columnWidth, handleCardPress]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={CARDS_DATA}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.contentContainer}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  contentContainer: {
    paddingVertical: spacing.md,
  },
});
