import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { formatDayLabel, getDateRange, toDateKey } from '@/utils/date';

interface DateStripProps {
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
}

export const DateStrip = ({ selectedDate, onSelectDate }: DateStripProps) => {
  const dates = React.useMemo(() => getDateRange(new Date()), []);

  return (
    <FlatList
      data={dates}
      horizontal
      keyExtractor={(item) => item.toISOString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const dateKey = toDateKey(item);
        const isActive = dateKey === selectedDate;
        return (
          <Pressable
            onPress={() => onSelectDate(dateKey)}
            style={[styles.dateChip, isActive && styles.dateChipActive]}
          >
            <Text style={[styles.dateText, isActive && styles.dateTextActive]}>{formatDayLabel(item)}</Text>
          </Pressable>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  dateChip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.dark.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  dateChipActive: {
    backgroundColor: Colors.dark.accent,
  },
  dateText: {
    color: Colors.dark.muted,
    fontWeight: '600',
  },
  dateTextActive: {
    color: Colors.dark.background,
  },
});
