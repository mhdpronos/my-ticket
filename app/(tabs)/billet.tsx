import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { LigneElementBillet } from '@/composants/billet/element-billet';
import { TexteTheme } from '@/composants/texte-theme';
import { useCouleurTheme } from '@/crochets/utiliser-couleur-theme';
import { useTicket } from '@/etat/etat-ticket';

// Écran de résumé du ticket.

export default function EcranBillet() {
  const { items, removeItem } = useTicket();
  const background = useCouleurTheme({}, 'background');
  const card = useCouleurTheme({}, 'card');
  const border = useCouleurTheme({}, 'border');
  const mutedText = useCouleurTheme({}, 'mutedText');

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.header}>
        <View>
          <TexteTheme type="title">Billet</TexteTheme>
          <TexteTheme style={{ color: mutedText }}>Résumé de tes sélections</TexteTheme>
        </View>
        <TouchableOpacity style={[styles.shareButton, { borderColor: border, backgroundColor: card }]}>
          <MaterialCommunityIcons name="share-variant-outline" size={18} color={mutedText} />
          <TexteTheme style={{ color: mutedText }}>Partager</TexteTheme>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.matchId}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <LigneElementBillet item={item} onRemove={() => removeItem(item.matchId)} />}
        ListEmptyComponent={
          <View style={[styles.emptyCard, { borderColor: border, backgroundColor: card }]}>
            <TexteTheme type="defaultSemiBold">Aucune sélection pour le moment</TexteTheme>
            <TexteTheme style={{ color: mutedText }}>
              Ajoute un pronostic depuis la page Matchs pour composer ton ticket.
            </TexteTheme>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      <View style={[styles.bookmakerPanel, { borderColor: border, backgroundColor: card }]}>
        <TexteTheme type="defaultSemiBold">Parier avec</TexteTheme>
        <View style={styles.bookmakers}>
          {['1xBet', 'Betwinner', 'Melbet'].map((name) => (
            <View key={name} style={[styles.bookmakerChip, { borderColor: border }]}>
              <TexteTheme type="defaultSemiBold">{name}</TexteTheme>
              <TexteTheme style={{ color: mutedText }}>Cotes en direct</TexteTheme>
            </View>
          ))}
        </View>
      </View>
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
  shareButton: {
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
  bookmakerPanel: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  bookmakers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  bookmakerChip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 4,
  },
});
