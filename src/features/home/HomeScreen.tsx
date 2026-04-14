import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { spacing } from '../../theme/spacing';
import { colors } from '../../theme/colors';
import { AppHeader } from '../../components/layout/AppHeader/AppHeader';
import { SearchBar } from '../../components/composites/SearchBar';
import { CategoriesSection } from './components/CategoriesSection';
import { ProphetStoriesSection } from './components/ProphetStoriesSection';
import ProphetReelsSection from './components/ProphetReelsSection';
import { useRouter } from 'expo-router';
import { useGetProphetStoriesQuery, useGetProphetReelsQuery } from '../../store/api/storiesApi';

export default function HomeScreen() {
  const router = useRouter();
  const pattern = require('../../../assets/pattern.png');

  const { data: prophetStories = [] } = useGetProphetStoriesQuery();
  const { data: prophetReels = [] } = useGetProphetReelsQuery();

  const onCategorySelect = useCallback(
    (id: string) => {
      if (id === 'morals') {
        router.push('/library/daily-prayer');
        return;
      }
      if (id === 'heroes') {
        router.push('/(tabs)/progress');
        return;
      }
      router.push('/library/daily-verse');
    },
    [router]
  );
  
  const onOpenStory = useCallback((id: string) => {
    const story = prophetStories.find(s => s.id === id);
    router.push({
      pathname: `/reel/${id}`,
      params: { title: story?.title }
    });
  }, [router, prophetStories]);

  const onOpenReel = useCallback((id: string) => {
    const reel = prophetReels.find(r => r.id === id);
    router.push({
      pathname: `/reel/${id}`,
      params: { 
        title: reel?.title,
        // Since we can't easily pass a require() through params, 
        // the detail screen should probably fetch or have its own mapping.
      }
    });
  }, [router, prophetReels]);

  const onSearch = useCallback((q: string) => {}, []);

  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.patternWrap} pointerEvents="none">
        <Image source={pattern} style={styles.pattern} resizeMode="repeat" />
      </View>

      <AppHeader />
      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SearchBar style={styles.search} onSearch={onSearch} />
        
        <View style={styles.sectionContainer}>
          <CategoriesSection onSelect={onCategorySelect} />
        </View>

        <View style={styles.sectionContainer}>
          <ProphetStoriesSection stories={prophetStories} onOpen={onOpenStory} />
        </View>

        <View style={styles.sectionContainer}>
          <ProphetReelsSection reels={prophetReels} onOpen={onOpenReel} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  patternWrap: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
  },
  pattern: {
    width: '100%',
    height: '100%',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: spacing.md,
    paddingBottom: 120, // Increased to prevent bottom nav overlap
  },
  search: {
    marginBottom: spacing.lg,
  },
  sectionContainer: {
    marginBottom: spacing.md,
  },
});
