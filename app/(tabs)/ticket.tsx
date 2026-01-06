import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { TicketItemRow } from '@/components/ticket/TicketItemRow';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAppStore } from '@/store/useAppStore';

export default function TicketScreen() {
  const ticketItems = useAppStore((state) => state.ticketItems);
  const removeTicketItem = useAppStore((state) => state.removeTicketItem);
  const clearTicket = useAppStore((state) => state.clearTicket);

  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.header}>
        <View>
          <ThemedText type="title">Ticket</ThemedText>
          <ThemedText style={{ color: mutedText }}>Résumé de tes sélections</ThemedText>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={clearTicket}
          style={[styles.clearButton, { borderColor: border, backgroundColor: card }]}>
          <MaterialCommunityIcons name="broom" size={18} color={mutedText} />
          <ThemedText style={{ color: mutedText }}>Vider</ThemedText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={ticketItems}
        keyExtractor={(item) => item.match.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TicketItemRow item={item} onRemove={() => removeTicketItem(item.match.id)} />
        )}
        ListEmptyComponent={
          <View style={[styles.emptyCard, { borderColor: border, backgroundColor: card }]}>
            <ThemedText type="defaultSemiBold">Aucune sélection pour le moment</ThemedText>
            <ThemedText style={{ color: mutedText }}>
              Ajoute un pronostic depuis la page Matchs pour composer ton ticket.
            </ThemedText>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  list: {
    gap: 12,
    paddingBottom: 20,
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
});
