import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { RollingDate } from '@/utils/dateRange';

type DateStripProps = {
  dates: RollingDate[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function DateStrip({ dates, selectedId, onSelect }: DateStripProps) {
  const highlight = useThemeColor({}, 'tint');
  const border = useThemeColor({}, 'border');
  const card = useThemeColor({}, 'card');
  const mutedText = useThemeColor({}, 'mutedText');
  const accent = useThemeColor({}, 'accent');

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      <View style={styles.row}>
        {dates.map((date) => {
          const isSelected = date.id === selectedId;
          const weekday = date.date
            .toLocaleDateString('fr-FR', { weekday: 'short' })
            .replace('.', '');
          const dayLabel = `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}`;
          const dateLabel = date.date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
          });
          return (
            <TouchableOpacity
              key={date.id}
              style={[
                styles.pill,
                {
                  backgroundColor: isSelected ? highlight : card,
                  borderColor: border,
                  shadowColor: isSelected ? highlight : 'transparent',
                },
                isSelected ? styles.pillSelected : null,
              ]}
              onPress={() => onSelect(date.id)}>
              <ThemedText
                type="defaultSemiBold"
                style={{
                  color: isSelected ? '#FFFFFF' : mutedText,
                }}>
                {dayLabel}
              </ThemedText>
              <ThemedText
                type="defaultSemiBold"
                style={{
                  color: isSelected ? '#FFFFFF' : date.isToday ? accent : mutedText,
                },
                numberOfLines={1}>
                {dateLabel}
              </ThemedText>
              {date.isToday && (
                <View style={[styles.todayTag, { backgroundColor: isSelected ? '#FFFFFF' : accent }]}>
                  <ThemedText style={{ color: isSelected ? highlight : '#FFFFFF' }} numberOfLines={1}>
                    Aujourd&apos;hui
                  </ThemedText>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
    minWidth: 86,
  },
  pillSelected: {
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  todayTag: {
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});
