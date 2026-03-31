import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import Card from '../../src/components/ui/Card';
import Text from '../../src/components/ui/Text';
import { BIBLE_BOOKS } from '../../src/features/bible/data';

export default function BibleScreen() {
  const [bookIndex, setBookIndex] = useState(0);
  const [chapterIndex, setChapterIndex] = useState(0);

  const selectedBook = BIBLE_BOOKS[bookIndex];
  const chapters = selectedBook.chapters;
  const selectedChapter = chapters[chapterIndex] ?? chapters[0];

  const chapterLabel = useMemo(
    () => `${selectedBook.name} ${selectedChapter.chapter}`,
    [selectedBook.name, selectedChapter.chapter]
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text variant="xs" color="textSecondary">
        Bible
      </Text>
      <Text variant="xl" bold style={styles.mtSm}>
        Read and reflect
      </Text>

      <View style={styles.section}>
        <Text variant="xs" color="textSecondary">
          Books
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalRow}>
          {BIBLE_BOOKS.map((book, index) => {
            const active = index === bookIndex;
            return (
              <TouchableOpacity
                key={book.id}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => {
                  setBookIndex(index);
                  setChapterIndex(0);
                }}
              >
                <Text variant="xs" color={active ? 'textPrimary' : 'textSecondary'}>
                  {book.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text variant="xs" color="textSecondary">
          Chapters
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalRow}>
          {chapters.map((chapter, index) => {
            const active = index === chapterIndex;
            return (
              <TouchableOpacity
                key={`${selectedBook.id}-${chapter.chapter}`}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setChapterIndex(index)}
              >
                <Text variant="xs" color={active ? 'textPrimary' : 'textSecondary'}>
                  Chapter {chapter.chapter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <Card style={styles.versesCard} elevated>
        <Text variant="md" bold>
          {chapterLabel}
        </Text>
        {selectedChapter.verses.map((verse, index) => (
          <View key={`${chapterLabel}-${index}`} style={styles.verseRow}>
            <Text variant="xs" color="warning" style={styles.verseIndex}>
              {index + 1}
            </Text>
            <Text variant="sm" color="textSecondary" style={styles.verseText}>
              {verse}
            </Text>
          </View>
        ))}
      </Card>
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
  mtSm: {
    marginTop: spacing.sm,
  },
  section: {
    marginTop: spacing.lg,
  },
  horizontalRow: {
    marginTop: spacing.sm,
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderTranslucent,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: 'transparent',
  },
  versesCard: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  verseRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  verseIndex: {
    width: 20,
  },
  verseText: {
    flex: 1,
    lineHeight: 22,
  },
});