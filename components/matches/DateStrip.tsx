import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ui/ThemedText';
import { useHapticOnScroll } from '@/hooks/useHapticOnScroll';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { RollingDate } from '@/utils/dateRange';
import { getLocale } from '@/utils/i18n';

type DateStripProps = {
  dates: RollingDate[];
  selectedId: string;
  onSelect: (id: string) => void;
};

const formatDay = (date: Date, locale: string) =>
  date
    .toLocaleDateString(locale, {
      weekday: 'short',
    })
    .replace('.', '')
    .replace(/^[a-z]/, (value) => value.toUpperCase());

const formatDate = (date: Date, locale: string) =>
  date
    .toLocaleDateString(locale, {
      day: '2-digit',
      month: 'short',
    })
    .replace('.', '')
    .replace(/^[a-z]/, (value) => value.toUpperCase());

export function DateStrip({ dates, selectedId, onSelect }: DateStripProps) {
  const highlight = useThemeColor({}, 'tint');
  const border = useThemeColor({}, 'border');
  const card = useThemeColor({}, 'card');
  const mutedText = useThemeColor({}, 'mutedText');
  const { t, language } = useTranslation();
  const locale = getLocale(language);
  const scrollHaptics = useHapticOnScroll();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.row}
      {...scrollHaptics}>
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
              isSelected ? styles.selectedPill : null,
            ]}
            onPress={() => onSelect(date.id)}>
            <ThemedText
              type="defaultSemiBold"
              style={[
                styles.dayText,
                {
                  color: isSelected ? '#FFFFFF' : mutedText,
                },
              ]}>
              {formatDay(date.date, locale)}
            </ThemedText>
            <ThemedText
              style={[
                styles.dateText,
                {
                  color: isSelected ? '#FFFFFF' : mutedText,
                },
              ]}>
              {formatDate(date.date, locale)}
            </ThemedText>
            {date.isToday ? (
              <View style={[styles.todayBadge, { backgroundColor: isSelected ? '#FFFFFF' : highlight }]}>
                <ThemedText style={{ color: isSelected ? highlight : '#FFFFFF' }}>{t('today')}</ThemedText>
              </View>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: 16,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 2,
    alignItems: 'center',
    minWidth: 72,
  },
  dayText: {
    fontSize: 12,
  },
  dateText: {
    fontSize: 12,
  },
  selectedPill: {
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  todayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
});
