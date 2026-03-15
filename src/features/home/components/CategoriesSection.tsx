import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { SectionHeader } from '../../../components/composites/SectionHeader';
import { CategoryChip } from '../../../components/composites/CategoryChip';
import { spacing } from '../../../theme/spacing';

interface Category {
  id: string;
  label: string;
}

interface Props {
  categories: Category[];
  onSelect: (id: string) => void;
  loading?: boolean;
}

export const CategoriesSection: React.FC<Props> = React.memo(({ categories, onSelect, loading }) => {
  const renderItem = useCallback(({ item }: { item: Category }) => {
    return <CategoryChip label={item.label} onPress={() => onSelect(item.id)} style={styles.chip} />;
  }, [onSelect]);

  const keyExtractor = useCallback((item: Category) => item.id, []);

  return (
    <View style={styles.container}>
      <SectionHeader title="Categories" />
      {loading ? (
        <View style={[styles.content, styles.skeletonRow]}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={`cs-${i}`} style={styles.skeletonItem} />
          ))}
        </View>
      ) : (
        <FlashList
          data={categories}
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
  chip: {
    marginRight: spacing.sm,
  },
  skeletonRow: {
    flexDirection: 'row',
  },
  skeletonItem: {
    width: 100,
    height: 44,
    borderRadius: 999,
    backgroundColor: '#1a1a1a',
    marginRight: spacing.sm,
  },
});

export default CategoriesSection;
