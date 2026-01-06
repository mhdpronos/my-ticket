import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useMemo, useState } from 'react';

import { BandeDate } from '@/composants/rencontres/bande-date';
import { FeuilleBasRencontre } from '@/composants/rencontres/feuille-bas-rencontre';
import { CarteRencontre } from '@/composants/rencontres/carte-rencontre';
import { TexteTheme } from '@/composants/texte-theme';
import { useCouleurTheme } from '@/crochets/utiliser-couleur-theme';
import { useTicket } from '@/etat/etat-ticket';
import { Match } from '@/types/domaine';
import { buildRollingDates } from '@/utilitaires/plage-dates';
import { getMatches } from '@/services/service-rencontres';

// Écran principal des matchs avec calendrier glissant et feuille de pronostics.

export default function EcranMatchs() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedDateId, setSelectedDateId] = useState(buildRollingDates()[2].id);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { addItem } = useTicket();

  const background = useCouleurTheme({}, 'background');
  const card = useCouleurTheme({}, 'card');
  const border = useCouleurTheme({}, 'border');
  const mutedText = useCouleurTheme({}, 'mutedText');

  const dates = useMemo(() => buildRollingDates(), []);

  useEffect(() => {
    // Charge les matchs (fictif pour l'instant, API plus tard).
    const loadMatches = async () => {
      const data = await getMatches();
      setMatches(data);
    };

    loadMatches();
  }, []);

  const visibleMatches = useMemo(() => {
    return matches.filter((match) => {
      const query = searchValue.toLowerCase();
      const matchesTeams =
        match.homeTeam.toLowerCase().includes(query) || match.awayTeam.toLowerCase().includes(query);

      return matchesTeams || query.length === 0;
    });
  }, [matches, searchValue]);

  const handleOpenMatch = (match: Match) => {
    setSelectedMatch(match);
    setIsSheetOpen(true);
  };

  const handleAddPrediction = (match: Match, predictionId: string) => {
    const prediction = match.predictions.find((item) => item.id === predictionId);
    if (!prediction) {
      return;
    }

    addItem({
      matchId: match.id,
      matchLabel: `${match.homeTeam} - ${match.awayTeam}`,
      prediction,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.header}>
        <View>
          <TexteTheme type="title">MON TICKET</TexteTheme>
          <TexteTheme style={{ color: mutedText }}>Crée ton billet. Compare les cotes.</TexteTheme>
        </View>
        <View style={[styles.notificationButton, { borderColor: border }]}>
          <MaterialCommunityIcons name="bell-outline" size={20} color={mutedText} />
        </View>
      </View>

      <BandeDate dates={dates} selectedId={selectedDateId} onSelect={setSelectedDateId} />

      <View style={[styles.searchBox, { backgroundColor: card, borderColor: border }]}>
        <MaterialCommunityIcons name="magnify" size={18} color={mutedText} />
        <TextInput
          placeholder="Rechercher une équipe"
          placeholderTextColor={mutedText}
          value={searchValue}
          onChangeText={setSearchValue}
          style={[styles.searchInput, { color: mutedText }]}
        />
      </View>

      <View style={styles.filterRow}>
        <View style={[styles.filterChip, { borderColor: border, backgroundColor: card }]}
        >
          <TexteTheme style={{ color: mutedText }}>Toutes les ligues</TexteTheme>
        </View>
        <View style={[styles.filterChip, { borderColor: border, backgroundColor: card }]}
        >
          <TexteTheme style={{ color: mutedText }}>Tous les pays</TexteTheme>
        </View>
      </View>

      <FlatList
        data={visibleMatches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <CarteRencontre match={item} onPress={() => handleOpenMatch(item)} />}
        showsVerticalScrollIndicator={false}
      />

      <FeuilleBasRencontre
        match={selectedMatch}
        visible={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onAddPrediction={handleAddPrediction}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    gap: 12,
  },
});
