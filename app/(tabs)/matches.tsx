// Le code de la page principale des matchs et des filtres.
import {
  ActivityIndicator,
  Modal,
  Pressable,
  SectionList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';

import { DateStrip } from '@/components/matches/DateStrip';
import { MatchCard } from '@/components/matches/MatchCard';
import { MatchBottomSheet } from '@/components/matches/MatchBottomSheet';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getMatchesByDate } from '@/services/matchesService';
import { getPredictionsForMatch } from '@/services/predictionsService';
import { useAppStore } from '@/store/useAppStore';
import { Match, MatchStatus, Prediction } from '@/types';
import { buildRollingDates } from '@/utils/dateRange';

export default function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [selectedStatus, setSelectedStatus] = useState<MatchStatus | 'all'>('all');
  const [isLeagueModalOpen, setIsLeagueModalOpen] = useState(false);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const dates = useMemo(() => buildRollingDates(), []);

  const selectedDateId = useAppStore((state) => state.selectedDateId);
  const setSelectedDateId = useAppStore((state) => state.setSelectedDateId);
  const favoriteTeams = useAppStore((state) => state.favoriteTeams);
  const favoriteLeagues = useAppStore((state) => state.favoriteLeagues);
  const toggleFavoriteTeam = useAppStore((state) => state.toggleFavoriteTeam);
  const toggleFavoriteLeague = useAppStore((state) => state.toggleFavoriteLeague);
  const addTicketItem = useAppStore((state) => state.addTicketItem);
  const userAccess = useAppStore((state) => state.userAccess);

  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');
  const text = useThemeColor({}, 'text');

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

  const countryOptions = useMemo(() => {
    return Array.from(new Set(matches.map((match) => match.league.country))).sort((a, b) => a.localeCompare(b, 'fr'));
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

      return (
        (matchesTeams || query.length === 0) &&
        matchesLeague &&
        matchesCountry &&
        matchesFavorites &&
        matchesTime &&
        matchesStatus
      );
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

  const handleOpenMatch = async (match: Match) => {
    setSelectedMatch(match);
    setIsBottomSheetVisible(true);
    const predictionsData = await getPredictionsForMatch(match.id);
    setPredictions(predictionsData);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetVisible(false);
    setSelectedMatch(null);
    setPredictions([]);
  };

  const selectedLeagueLabel =
    leagueOptions.find((league) => league.id === selectedLeagueId)?.name ?? 'Tous les championnats';

  const selectedCountryLabel = selectedCountry ?? 'Tous les pays';

  const isTeamFavorite = (teamId: string) => favoriteTeams.includes(teamId);
  const isLeagueFavorite = (leagueId: string) => favoriteLeagues.includes(leagueId);
  const statusLabels: Record<MatchStatus | 'all', string> = {
    all: 'Statut',
    upcoming: 'À venir',
    live: 'En direct',
    finished: 'Terminés',
  };
  const timeLabels: Record<typeof selectedTimeSlot, string> = {
    all: 'Heure',
    morning: 'Matin',
    afternoon: 'Après-midi',
    evening: 'Soir',
  };
  const sections = useMemo(() => [{ title: 'CALENDRIER', data: visibleMatches }], [visibleMatches]);

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderSectionHeader={() => (
          <View style={[styles.calendarHeader, { backgroundColor: background }]}>
            <View style={styles.calendarTitleRow}>
              <ThemedText style={[styles.sectionTitle, { color: mutedText }]}>CALENDRIER</ThemedText>
            </View>
            <DateStrip dates={dates} selectedId={selectedDateId ?? dates[2].id} onSelect={setSelectedDateId} />
          </View>
        )}
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
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <ThemedText type="title" style={styles.brandTitle}>
                  MY TICKET
                </ThemedText>
                <ThemedText style={{ color: mutedText }} numberOfLines={1} ellipsizeMode="tail">
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
            <View style={[styles.divider, { backgroundColor: border }]} />
            <View style={[styles.searchBox, { backgroundColor: card, borderColor: border }]}>
              <MaterialCommunityIcons name="magnify" size={18} color={mutedText} />
              <TextInput
                placeholder="Rechercher un match, équipe, ligue…"
                placeholderTextColor={mutedText}
                value={searchValue}
                onChangeText={setSearchValue}
                style={[styles.searchInput, { color: text }]}
              />
            </View>
            <View style={[styles.filterPanel, { backgroundColor: card, borderColor: border }]}>
              <View style={styles.filterRow}>
                <FilterChip
                  label="Favoris"
                  icon="star-outline"
                  active={favoritesOnly}
                  onPress={() => setFavoritesOnly((value) => !value)}
                />
                <FilterChip
                  label={selectedLeagueLabel}
                  icon="trophy-outline"
                  onPress={() => setIsLeagueModalOpen(true)}
                  active={Boolean(selectedLeagueId)}
                />
              </View>
              <View style={styles.filterRow}>
                <FilterChip
                  label={selectedCountryLabel}
                  icon="earth"
                  onPress={() => setIsCountryModalOpen(true)}
                  active={Boolean(selectedCountry)}
                />
                <FilterChip
                  label={timeLabels[selectedTimeSlot]}
                  icon="clock-outline"
                  onPress={() =>
                    setSelectedTimeSlot((prev) =>
                      prev === 'all' ? 'morning' : prev === 'morning' ? 'afternoon' : prev === 'afternoon' ? 'evening' : 'all'
                    )
                  }
                  active={selectedTimeSlot !== 'all'}
                />
                <FilterChip
                  label={statusLabels[selectedStatus]}
                  icon={selectedStatus === 'live' ? 'record-circle-outline' : 'signal'}
                  onPress={() => {
                    const order: Array<MatchStatus | 'all'> = ['all', 'upcoming', 'live', 'finished'];
                    const next = order[(order.indexOf(selectedStatus) + 1) % order.length];
                    setSelectedStatus(next);
                  }}
                  active={selectedStatus !== 'all'}
                />
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          isLoading ? null : (
            <View style={[styles.emptyCard, { borderColor: border, backgroundColor: card }]}>
              <ThemedText type="defaultSemiBold">Aucun match trouvé</ThemedText>
              <ThemedText style={{ color: mutedText }}>Ajuste tes filtres ou change de date.</ThemedText>
            </View>
          )
        }
        stickySectionHeadersEnabled
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={8}
        ListFooterComponent={isLoading ? null : <View style={styles.listFooter} />}
      />

      {isLoading && (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={tint} />
          <ThemedText style={{ color: mutedText }}>Chargement des matchs...</ThemedText>
        </View>
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

      <Modal animationType="slide" transparent visible={isCountryModalOpen} onRequestClose={() => setIsCountryModalOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setIsCountryModalOpen(false)}>
          <View
            style={[styles.modalCard, { backgroundColor: card, borderColor: border }]}
            onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <ThemedText type="defaultSemiBold">Choisir un pays</ThemedText>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => setIsCountryModalOpen(false)}
                style={[styles.modalCloseButton, { borderColor: border }]}>
                <MaterialCommunityIcons name="close" size={18} color={mutedText} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.modalItem, { borderColor: border }]}
              onPress={() => {
                setSelectedCountry(null);
                setIsCountryModalOpen(false);
              }}>
              <ThemedText style={{ color: mutedText }}>Tous les pays</ThemedText>
            </TouchableOpacity>
            {countryOptions.map((country) => (
              <TouchableOpacity
                key={country}
                style={[styles.modalItem, { borderColor: border }]}
                onPress={() => {
                  setSelectedCountry(country);
                  setIsCountryModalOpen(false);
                }}>
                <ThemedText style={{ color: mutedText }}>{country}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      <MatchBottomSheet
        match={selectedMatch}
        visible={isBottomSheetVisible}
        predictions={predictions}
        userAccess={userAccess}
        onClose={handleCloseBottomSheet}
        onAddPrediction={(match, prediction) => addTicketItem(match, prediction)}
      />
    </View>
  );
}

type FilterChipProps = {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  active?: boolean;
  onPress: () => void;
};

function FilterChip({ label, icon, active = false, onPress }: FilterChipProps) {
  const border = useThemeColor({}, 'border');
  const card = useThemeColor({}, 'card');
  const mutedText = useThemeColor({}, 'mutedText');
  const accent = useThemeColor({}, 'accent');

  return (
    <TouchableOpacity
      accessibilityRole="button"
      style={[
        styles.filterChip,
        { borderColor: border, backgroundColor: active ? accent : card },
      ]}
      onPress={onPress}>
      <MaterialCommunityIcons name={icon} size={14} color={active ? '#FFFFFF' : mutedText} />
      <ThemedText style={{ color: active ? '#FFFFFF' : mutedText }} numberOfLines={1}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  headerBlock: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  divider: {
    height: 1,
    width: '100%',
    opacity: 0.5,
  },
  brandTitle: {
    letterSpacing: 1,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarHeader: {
    paddingTop: 4,
    paddingBottom: 8,
    gap: 8,
  },
  calendarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  filterPanel: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    gap: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 140,
    gap: 12,
  },
  loadingState: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
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
  listFooter: {
    height: 80,
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
