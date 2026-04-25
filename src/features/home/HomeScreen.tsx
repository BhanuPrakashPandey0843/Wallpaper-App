import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { spacing } from '../../theme/spacing';
import { colors } from '../../theme/colors';
import { HomeHeader } from './components/HomeHeader';
import { VerseOfTheDay } from './components/VerseOfTheDay';
import { CategoriesSection } from './components/CategoriesSection';
import { ProphetStoriesSection } from './components/ProphetStoriesSection';
import ProphetReelsSection from './components/ProphetReelsSection';
import { AnimatedBackground } from '../../components/ui/AnimatedBackground';
import { useRouter } from 'expo-router';
import { useGetProphetStoriesQuery, useGetProphetReelsQuery } from '../../store/api/storiesApi';

export default function HomeScreen() {
  const router = useRouter();

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
      }
    });
  }, [router, prophetReels]);

  const onSearchPress = useCallback(() => {
    // Navigate to search or open modal
  }, []);

  const onProfilePress = useCallback(() => {
    router.push('/settings-view/account');
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Premium Animated Background */}
      <AnimatedBackground />

      <HomeHeader onSearchPress={onSearchPress} onProfilePress={onProfilePress} />

      <Animated.ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        entering={FadeIn.duration(800)}
      >
        {/* Featured Hero Section */}
        <VerseOfTheDay />
        
        {/* Categories Chips */}
        <CategoriesSection onSelect={onCategorySelect} />

        {/* Stories Section */}
        <ProphetStoriesSection stories={prophetStories} onOpen={onOpenStory} />

        {/* Reels Section */}
        <ProphetReelsSection reels={prophetReels} onOpen={onOpenReel} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 120,
  },
});
