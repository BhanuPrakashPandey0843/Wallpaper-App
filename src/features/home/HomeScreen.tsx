import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { spacing } from '../../theme/spacing';
import { colors } from '../../theme/colors';
import { AppHeader } from '../../components/layout/AppHeader/AppHeader';
import { SearchBar } from '../../components/composites/SearchBar';
import { CategoriesSection } from './components/CategoriesSection';
import { IslamicHistorySection } from './components/IslamicHistorySection';
import { ProphetStoriesSection } from './components/ProphetStoriesSection';
import { useGetWallpapersQuery } from '../../store/api/wallpapersApi';

export default function HomeScreen() {
  const { data, isLoading, isFetching, refetch } = useGetWallpapersQuery({ page: 1 });

  const categories = useMemo(
    () => [
      { id: 'islamic', label: 'Islamic History' },
      { id: 'prophets', label: 'Prophet Stories' },
      { id: 'wisdom', label: 'Wisdom' },
      { id: 'heritage', label: 'Heritage' },
    ],
    []
  );

  const onCategorySelect = useCallback((id: string) => {}, []);
  const onOpenStory = useCallback((id: string) => {}, []);
  const onSearch = useCallback((q: string) => {}, []);

  const storiesA = useMemo(
    () =>
      (data ?? []).slice(0, 10).map((w) => ({
        id: w.id,
        title: w.title,
        image: { uri: w.image.preview, blurhash: w.image.blurhash },
      })),
    [data]
  );
  const storiesB = useMemo(
    () =>
      (data ?? []).slice(10, 20).map((w) => ({
        id: w.id,
        title: w.title,
        image: { uri: w.image.preview, blurhash: w.image.blurhash },
      })),
    [data]
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AppHeader />
      <SearchBar placeholder="Search stories" onSearch={onSearch} style={styles.search} />
      <CategoriesSection categories={categories} onSelect={onCategorySelect} loading={isLoading || isFetching} />
      <IslamicHistorySection stories={storiesA} onOpen={onOpenStory} loading={isLoading || isFetching} />
      <ProphetStoriesSection stories={storiesB} onOpen={onOpenStory} loading={isLoading || isFetching} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  search: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
});
