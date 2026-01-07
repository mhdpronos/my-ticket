// Le code de la page principale des matchs et des filtres.
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';

import { DateStrip } from '@/components/matches/DateStrip';
import { MatchCard } from '@/components/matches/MatchCard';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getMatchesByDate } from '@/services/matchesService';
import { useAppStore } from '@/store/useAppStore';
import { Match } from '@/types';
import { buildRollingDates } from '@/utils/dateRange';

export default function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [isLeagueModalOpen, setIsLeagueModalOpen] = useState(false);

  const dates = useMemo(() => buildRollingDates(), []);

  const selectedDateId = useAppStore((state) => state.selectedDateId);
  const setSelectedDateId = useAppStore((state) => state.setSelectedDateId);
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
  const accent = useThemeColor({}, 'accent');

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

  const leagueOptions = useMemo(() => {
    const unique = new Map(matches.map((match) => [match.league.id, match.league]));
    return Array.from(unique.values()).sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  }, [matches]);

  const visibleMatches = useMemo(() => {
    return matches.filter((match) => {
      const query = searchValue.toLowerCase();
      const matchesTeams =
        match.homeTeam.name.toLowerCase().includes(query) || match.awayTeam.name.toLowerCase().includes(query);

      const matchesLeague = selectedLeagueId ? match.league.id === selectedLeagueId : true;
      return (matchesTeams || query.length === 0) && matchesLeague;
    });
  }, [matches, searchValue, selectedLeagueId]);

  const handleOpenMatch = (match: Match) => {
    router.push({ pathname: '/match-details', params: { matchId: match.id } });
  };

  const selectedLeagueLabel =
    leagueOptions.find((league) => league.id === selectedLeagueId)?.name ?? 'Tous les championnats';

  const isTeamFavorite = (teamId: string) => favoriteTeams.includes(teamId);
  const isLeagueFavorite = (leagueId: string) => favoriteLeagues.includes(leagueId);

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.header}>
        <View>
          <ThemedText type="title" style={styles.brandTitle}>
            MY TICKET
          </ThemedText>
          <ThemedText style={{ color: mutedText }}>Crée ton ticket. Compare les cotes. Parie où tu veux.</ThemedText>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.push('/notifications')}
          style={[styles.notificationButton, { borderColor: border, backgroundColor: card }]}>
          <MaterialCommunityIcons name="bell-outline" size={20} color={mutedText} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={[styles.searchBox, { backgroundColor: card, borderColor: border }]}>
          <MaterialCommunityIcons name="magnify" size={18} color={mutedText} />
          <TextInput
            placeholder="Rechercher un match"
            placeholderTextColor={mutedText}
            value={searchValue}
            onChangeText={setSearchValue}
            style={[styles.searchInput, { color: mutedText }]}
          />
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => setIsLeagueModalOpen(true)}
          style={[styles.filterButton, { borderColor: border, backgroundColor: card }]}>
          <MaterialCommunityIcons name="filter-variant" size={18} color={accent} />
        </TouchableOpacity>
      </View>

      <ThemedText style={[styles.sectionTitle, { color: mutedText }]}>Matchs à venir</ThemedText>
      <DateStrip dates={dates} selectedId={selectedDateId ?? dates[2].id} onSelect={setSelectedDateId} />

      <View style={styles.chipRow}>
        <TouchableOpacity
          style={[styles.filterChip, { borderColor: border, backgroundColor: card }]}
          onPress={() => setIsLeagueModalOpen(true)}>
          <ThemedText style={{ color: mutedText }}>{selectedLeagueLabel}</ThemedText>
        </TouchableOpacity>
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
              predictionCount={userAccess.status === 'PREMIUM' ? 6 : 3}
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

      <Modal animationType="slide" transparent visible={isLeagueModalOpen} onRequestClose={() => setIsLeagueModalOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setIsLeagueModalOpen(false)}>
          <View
            style={[styles.modalCard, { backgroundColor: card, borderColor: border }]}
            onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <ThemedText type="defaultSemiBold">Choisir un championnat</ThemedText>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => setIsLeagueModalOpen(false)}
                style={[styles.modalCloseButton, { borderColor: border }]}>
                <MaterialCommunityIcons name="close" size={18} color={mutedText} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.modalItem, { borderColor: border }]}
              onPress={() => {
                setSelectedLeagueId(null);
                setIsLeagueModalOpen(false);
              }}>
              <ThemedText style={{ color: mutedText }}>Tous les championnats</ThemedText>
            </TouchableOpacity>
            {leagueOptions.map((league) => (
              <TouchableOpacity
                key={league.id}
                style={[styles.modalItem, { borderColor: border }]}
                onPress={() => {
                  setSelectedLeagueId(league.id);
                  setIsLeagueModalOpen(false);
                }}>
                <ThemedText style={{ color: mutedText }}>{league.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
  },
  searchRow: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: 12,
  },
  brandTitle: {
    letterSpacing: 1.5,
    fontStyle: 'italic',
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
    marginBottom: 10,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
  },
  chipRow: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    marginBottom: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalItem: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
});
