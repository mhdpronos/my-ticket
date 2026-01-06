// Le code de la page principale des matchs et des filtres.
import { ActivityIndicator, FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';

import { DateStrip } from '@/components/matches/DateStrip';
import { MatchBottomSheet } from '@/components/matches/MatchBottomSheet';
import { MatchCard } from '@/components/matches/MatchCard';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getMatchesByDate } from '@/services/matchesService';
import { getPredictionsForMatch } from '@/services/predictionsService';
import { useAppStore } from '@/store/useAppStore';
import { Match, MatchStatus, Prediction } from '@/types';
import { buildRollingDates } from '@/utils/dateRange';

export default function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [selectedStatus, setSelectedStatus] = useState<MatchStatus | 'all'>('all');

  const dates = useMemo(() => buildRollingDates(), []);

  const selectedDateId = useAppStore((state) => state.selectedDateId);
  const setSelectedDateId = useAppStore((state) => state.setSelectedDateId);
  const addTicketItem = useAppStore((state) => state.addTicketItem);
  const favoriteTeams = useAppStore((state) => state.favoriteTeams);
  const favoriteLeagues = useAppStore((state) => state.favoriteLeagues);
  const toggleFavoriteTeam = useAppStore((state) => state.toggleFavoriteTeam);
  const toggleFavoriteLeague = useAppStore((state) => state.toggleFavoriteLeague);
  const userAccess = useAppStore((state) => state.userAccess);

  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');
  const success = useThemeColor({}, 'success');
  const warning = useThemeColor({}, 'warning');

  useEffect(() => {
    if (!selectedDateId) {
      setSelectedDateId(dates[2].id);
    }
  }, [dates, selectedDateId, setSelectedDateId]);

  useEffect(() => {
    if (!selectedDateId) {
      return;
    }
    const loadMatches = async () => {
      setIsLoading(true);
      const data = await getMatchesByDate(selectedDateId);
      setMatches(data);
      setIsLoading(false);
    };

    loadMatches();
  }, [selectedDateId]);

  useEffect(() => {
    if (!selectedMatch) {
      return;
    }
    const loadPredictions = async () => {
      const data = await getPredictionsForMatch(selectedMatch.id);
      setPredictions(data);
    };

    loadPredictions();
  }, [selectedMatch]);

  const leagueOptions = useMemo(() => {
    const unique = new Map(matches.map((match) => [match.league.id, match.league]));
    return Array.from(unique.values());
  }, [matches]);

  const countryOptions = useMemo(() => {
    const unique = new Set(matches.map((match) => match.league.country));
    return Array.from(unique);
  }, [matches]);

  const visibleMatches = useMemo(() => {
    return matches.filter((match) => {
      const query = searchValue.toLowerCase();
      const matchesTeams =
        match.homeTeam.name.toLowerCase().includes(query) || match.awayTeam.name.toLowerCase().includes(query);

      const matchesLeague = selectedLeagueId ? match.league.id === selectedLeagueId : true;
      const matchesCountry = selectedCountry ? match.league.country === selectedCountry : true;
      const matchesFavorites = favoritesOnly
        ? favoriteTeams.includes(match.homeTeam.id) ||
          favoriteTeams.includes(match.awayTeam.id) ||
          favoriteLeagues.includes(match.league.id)
        : true;

      const kickoffHour = new Date(match.kickoffIso).getHours();
      const matchesTime =
        selectedTimeSlot === 'all'
          ? true
          : selectedTimeSlot === 'morning'
          ? kickoffHour < 14
          : selectedTimeSlot === 'afternoon'
          ? kickoffHour >= 14 && kickoffHour < 19
          : kickoffHour >= 19;

      const matchesStatus = selectedStatus === 'all' ? true : match.status === selectedStatus;

      return (matchesTeams || query.length === 0) && matchesLeague && matchesCountry && matchesFavorites && matchesTime && matchesStatus;
    });
  }, [
    matches,
    searchValue,
    selectedLeagueId,
    selectedCountry,
    favoritesOnly,
    favoriteTeams,
    favoriteLeagues,
    selectedTimeSlot,
    selectedStatus,
  ]);

  const handleOpenMatch = (match: Match) => {
    setSelectedMatch(match);
    setIsSheetOpen(true);
  };

  const handleAddPrediction = (match: Match, prediction: Prediction) => {
    addTicketItem(match, prediction);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedMatch(null);
  };

  const isTeamFavorite = (teamId: string) => favoriteTeams.includes(teamId);
  const isLeagueFavorite = (leagueId: string) => favoriteLeagues.includes(leagueId);

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.header}>
        <View style={[styles.heroCard, { backgroundColor: card, borderColor: border }]}>
          <ThemedText type="title">Matchs</ThemedText>
          <ThemedText style={{ color: mutedText }}>
            Crée ton ticket, compare les cotes et suis tes pronostics en direct.
          </ThemedText>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.push('/notifications')}
          style={[styles.notificationButton, { borderColor: border, backgroundColor: card }]}>
          <MaterialCommunityIcons name="bell-outline" size={20} color={mutedText} />
        </TouchableOpacity>
      </View>

      <ThemedText style={[styles.sectionTitle, { color: mutedText }]}>Calendrier</ThemedText>
      <DateStrip dates={dates} selectedId={selectedDateId ?? dates[2].id} onSelect={setSelectedDateId} />

      <View style={[styles.filterPanel, { backgroundColor: card, borderColor: border }]}>
        <View style={[styles.searchBox, { backgroundColor: background, borderColor: border, borderWidth: 1 }]}>
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
          <TouchableOpacity
            style={[styles.filterChip, { borderColor: border, backgroundColor: favoritesOnly ? tint : card }]}
            onPress={() => setFavoritesOnly((value) => !value)}>
            <ThemedText style={{ color: favoritesOnly ? '#FFFFFF' : mutedText }}>Favoris</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, { borderColor: border, backgroundColor: card }]}
            onPress={() => {
              const currentIndex = leagueOptions.findIndex((league) => league.id === selectedLeagueId);
              const next = leagueOptions[currentIndex + 1] ?? null;
              setSelectedLeagueId(next ? next.id : null);
            }}>
            <ThemedText style={{ color: mutedText }}>
              {selectedLeagueId
                ? leagueOptions.find((league) => league.id === selectedLeagueId)?.name
                : 'Toutes les ligues'}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, { borderColor: border, backgroundColor: card }]}
            onPress={() => {
              const currentIndex = countryOptions.findIndex((country) => country === selectedCountry);
              const next = countryOptions[currentIndex + 1] ?? null;
              setSelectedCountry(next ?? null);
            }}>
            <ThemedText style={{ color: mutedText }}>{selectedCountry ?? 'Tous les pays'}</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, { borderColor: border, backgroundColor: card }]}
            onPress={() =>
              setSelectedTimeSlot((prev) =>
                prev === 'all' ? 'morning' : prev === 'morning' ? 'afternoon' : prev === 'afternoon' ? 'evening' : 'all'
              )
            }>
            <ThemedText style={{ color: mutedText }}>
              {selectedTimeSlot === 'all'
                ? 'Toutes heures'
                : selectedTimeSlot === 'morning'
                ? 'Matin'
                : selectedTimeSlot === 'afternoon'
                ? 'Après-midi'
                : 'Soir'}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, { borderColor: border, backgroundColor: selectedStatus === 'live' ? success : card }]}
            onPress={() => setSelectedStatus((prev) => (prev === 'live' ? 'all' : 'live'))}>
            <ThemedText style={{ color: selectedStatus === 'live' ? '#FFFFFF' : mutedText }}>En direct</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, { borderColor: border, backgroundColor: selectedStatus === 'finished' ? warning : card }]}
            onPress={() => setSelectedStatus((prev) => (prev === 'finished' ? 'all' : 'finished'))}>
            <ThemedText style={{ color: selectedStatus === 'finished' ? '#FFFFFF' : mutedText }}>Terminés</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, { borderColor: border, backgroundColor: selectedStatus === 'upcoming' ? tint : card }]}
            onPress={() => setSelectedStatus((prev) => (prev === 'upcoming' ? 'all' : 'upcoming'))}>
            <ThemedText style={{ color: selectedStatus === 'upcoming' ? '#FFFFFF' : mutedText }}>À venir</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={tint} />
          <ThemedText style={{ color: mutedText }}>Chargement des matchs...</ThemedText>
        </View>
      ) : (
        <FlatList
          data={visibleMatches}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <MatchCard
              match={item}
              onPress={() => handleOpenMatch(item)}
              onToggleTeamFavorite={toggleFavoriteTeam}
              onToggleLeagueFavorite={toggleFavoriteLeague}
              isTeamFavorite={isTeamFavorite}
              isLeagueFavorite={isLeagueFavorite}
            />
          )}
          ListEmptyComponent={
            <View style={[styles.emptyCard, { borderColor: border, backgroundColor: card }]}>
              <ThemedText type="defaultSemiBold">Aucun match trouvé</ThemedText>
              <ThemedText style={{ color: mutedText }}>Ajuste tes filtres ou change de date.</ThemedText>
            </View>
          }
          showsVerticalScrollIndicator={false}
          initialNumToRender={12}
          maxToRenderPerBatch={12}
          windowSize={8}
        />
      )}

      <MatchBottomSheet
        match={selectedMatch}
        visible={isSheetOpen}
        predictions={predictions}
        userAccess={userAccess}
        onClose={handleCloseSheet}
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
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: 12,
  },
  heroCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 6,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginBottom: 8,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  filterPanel: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    gap: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 140,
    gap: 12,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
});
