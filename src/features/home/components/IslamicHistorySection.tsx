import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { SectionHeader } from '../../../components/composites/SectionHeader';
import { StoryCard } from '../../../components/composites/StoryCard';
import { spacing } from '../../../theme/spacing';

interface Story {
  id: string;
  title: string;
  image: { uri: string; blurhash?: string };
}

interface Props {
  stories: Story[];
  onOpen: (id: string) => void;
  loading?: boolean;
}

export const IslamicHistorySection: React.FC<Props> = React.memo(({ stories, onOpen, loading }) => {
  const renderItem = useCallback(({ item }: { item: Story }) => {
    return <StoryCard title={item.title} image={{ uri: item.image.uri, blurhash: item.image.blurhash }} onPress={() => onOpen(item.id)} width={160} height={240} />;
  }, [onOpen]);

  const keyExtractor = useCallback((item: Story) => item.id, []);

  return (
    <View style={styles.container}>
      <SectionHeader title="Islamic History" />
      {loading ? (
        <View style={styles.content}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={`sh-${i}`} style={styles.skeleton} />
          ))}
        </View>
      ) : (
        <FlashList
          data={stories}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.content}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  content: {
    paddingHorizontal: spacing.md,
  },
  skeleton: {
    width: 160,
    height: 240,
    marginRight: spacing.md,
    borderRadius: 24,
    backgroundColor: '#1a1a1a',
  },
});

export default IslamicHistorySection;
