import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { TexteTheme } from '@/composants/texte-theme';
import { useCouleurTheme } from '@/crochets/utiliser-couleur-theme';
import { TicketItem } from '@/types/domaine';

// Ligne de ticket pour le match et le pronostic sélectionnés.

type LigneElementBilletProps = {
  item: TicketItem;
  onRemove: () => void;
};

export function LigneElementBillet({ item, onRemove }: LigneElementBilletProps) {
  const card = useCouleurTheme({}, 'card');
  const border = useCouleurTheme({}, 'border');
  const mutedText = useCouleurTheme({}, 'mutedText');

  return (
    <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
      <View style={styles.header}>
        <TexteTheme type="defaultSemiBold">{item.matchLabel}</TexteTheme>
        <TouchableOpacity onPress={onRemove} style={[styles.iconButton, { borderColor: border }]}>
          <MaterialCommunityIcons name="trash-can-outline" size={18} color={mutedText} />
        </TouchableOpacity>
      </View>
      <TexteTheme style={{ color: mutedText }}>{item.prediction.label}</TexteTheme>
      <View style={styles.bookmakers}>
        {item.prediction.bookmakers.map((bookmaker) => (
          <View key={bookmaker.id} style={[styles.bookmakerChip, { borderColor: border }]}>
            <TexteTheme type="defaultSemiBold">{bookmaker.name}</TexteTheme>
            <TexteTheme style={{ color: mutedText }}>{bookmaker.oddsDecimal.toFixed(2)}</TexteTheme>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    borderWidth: 1,
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmakers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bookmakerChip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 2,
  },
});
