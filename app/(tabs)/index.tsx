import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useMemo, useState } from 'react';

import { DateStrip } from '@/components/matches/date-strip';
import { MatchBottomSheet } from '@/components/matches/match-bottom-sheet';
import { MatchCard } from '@/components/matches/match-card';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTicket } from '@/store/ticket-store';
import { Match } from '@/types/domain';
import { buildRollingDates } from '@/utils/date-range';
import { getMatches } from '@/services/match-service';

// Main matches screen with rolling calendar and bottom sheet predictions.

export default function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedDateId, setSelectedDateId] = useState(buildRollingDates()[2].id);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { addItem } = useTicket();

  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');

  const dates = useMemo(() => buildRollingDates(), []);

  useEffect(() => {
    // Load matches (mock for now, API later).
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
          <ThemedText type="title">MY TICKET</ThemedText>
          <ThemedText style={{ color: mutedText }}>Crée ton ticket. Compare les cotes.</ThemedText>
        </View>
        <View style={[styles.notificationButton, { borderColor: border }]}>
          <MaterialCommunityIcons name="bell-outline" size={20} color={mutedText} />
        </View>
      </View>

      <DateStrip dates={dates} selectedId={selectedDateId} onSelect={setSelectedDateId} />

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
          <ThemedText style={{ color: mutedText }}>Toutes les ligues</ThemedText>
        </View>
        <View style={[styles.filterChip, { borderColor: border, backgroundColor: card }]}
        >
          <ThemedText style={{ color: mutedText }}>Tous les pays</ThemedText>
        </View>
      </View>

      <FlatList
        data={visibleMatches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <MatchCard match={item} onPress={() => handleOpenMatch(item)} />}
        showsVerticalScrollIndicator={false}
      />

      <MatchBottomSheet
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
