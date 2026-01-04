import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { RollingDate } from '@/utils/date-range';

// Horizontal date selector for the rolling calendar window.

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

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      <View style={styles.row}>
        {dates.map((date) => {
          const isSelected = date.id === selectedId;
          return (
            <TouchableOpacity
              key={date.id}
              style={[
                styles.pill,
                {
                  backgroundColor: isSelected ? highlight : card,
                  borderColor: border,
                },
              ]}
              onPress={() => onSelect(date.id)}>
              <ThemedText
                type="defaultSemiBold"
                style={{
                  color: isSelected ? '#FFFFFF' : date.isToday ? highlight : mutedText,
                }}>
                {date.label}
              </ThemedText>
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
    gap: 10,
    paddingHorizontal: 16,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
});
