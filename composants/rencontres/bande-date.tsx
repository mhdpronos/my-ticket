import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { TexteTheme } from '@/composants/texte-theme';
import { useCouleurTheme } from '@/crochets/utiliser-couleur-theme';
import { RollingDate } from '@/utilitaires/plage-dates';

// Sélecteur de dates horizontal pour le calendrier glissant.

type BandeDateProps = {
  dates: RollingDate[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function BandeDate({ dates, selectedId, onSelect }: BandeDateProps) {
  const highlight = useCouleurTheme({}, 'tint');
  const border = useCouleurTheme({}, 'border');
  const card = useCouleurTheme({}, 'card');
  const mutedText = useCouleurTheme({}, 'mutedText');

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
              <TexteTheme
                type="defaultSemiBold"
                style={{
                  color: isSelected ? '#FFFFFF' : date.isToday ? highlight : mutedText,
                }}>
                {date.label}
              </TexteTheme>
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
