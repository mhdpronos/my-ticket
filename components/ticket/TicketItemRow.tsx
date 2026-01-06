import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getBookmakers, getOddsForPrediction } from '@/services/oddsService';
import { TicketItem } from '@/types';

type TicketItemRowProps = {
  item: TicketItem;
  onRemove: () => void;
};

export function TicketItemRow({ item, onRemove }: TicketItemRowProps) {
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');

  const bookmakers = getBookmakers();
  const oddsByBookmaker = getOddsForPrediction(item.prediction);

  return (
    <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold">{item.match.homeTeam.name} - {item.match.awayTeam.name}</ThemedText>
        <TouchableOpacity onPress={onRemove} style={[styles.iconButton, { borderColor: border }]}>
          <MaterialCommunityIcons name="trash-can-outline" size={18} color={mutedText} />
        </TouchableOpacity>
      </View>
      <ThemedText style={{ color: mutedText }}>{item.prediction.label}</ThemedText>

      <View style={styles.bookmakerHeader}>
        <ThemedText type="defaultSemiBold">Parier avec</ThemedText>
      </View>
      <View style={styles.bookmakers}>
        {bookmakers.map((bookmaker) => (
          <View key={bookmaker.id} style={[styles.bookmakerChip, { borderColor: border }]}>
            <ThemedText type="defaultSemiBold">{bookmaker.name}</ThemedText>
            <ThemedText style={{ color: mutedText }}>
              {oddsByBookmaker[bookmaker.id] ? oddsByBookmaker[bookmaker.id].toFixed(2) : '--'}
            </ThemedText>
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
  bookmakerHeader: {
    marginTop: 4,
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
