// Le code de la page principale des matchs et des filtres.
import {
  ActivityIndicator,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  SectionList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { router } from 'expo-router';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';

import { DateStrip } from '@/components/matches/DateStrip';
import { MatchCard } from '@/components/matches/MatchCard';
import { BrandTitle } from '@/components/ui/BrandTitle';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { getMatchesByDate } from '@/services/matchesService';
import { useAppStore } from '@/store/useAppStore';
import { Match, MatchStatus } from '@/types';
import { buildRollingDates } from '@/utils/dateRange';
import { getLocale } from '@/utils/i18n';

type MatchSection = {
  key: 'calendar' | 'matches';
  data: Match[];
};

export default function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [selectedStatus, setSelectedStatus] = useState<MatchStatus | 'all'>('all');
  const [isLeagueModalOpen, setIsLeagueModalOpen] = useState(false);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const listRef = useRef<SectionList<Match>>(null);
  const hasFocusedOnce = useRef(false);
  const { t, language } = useTranslation();
  const locale = getLocale(language);

  const dates = useMemo(() => buildRollingDates(new Date(), locale), [locale]);

  const selectedDateId = useAppStore((state) => state.selectedDateId);
  const setSelectedDateId = useAppStore((state) => state.setSelectedDateId);
  const favoriteMatches = useAppStore((state) => state.favoriteMatches);
  const toggleFavoriteMatch = useAppStore((state) => state.toggleFavoriteMatch);

  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const text = useThemeColor({}, 'text');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');
  const warning = useThemeColor({}, 'warning');
  const danger = useThemeColor({}, 'danger');

  useEffect(() => {
    if (!selectedDateId) {
      setSelectedDateId(dates[2].id);
    }
  }, [dates, selectedDateId, setSelectedDateId]);

  const loadMatches = useCallback(
    async ({ showLoading, silent }: { showLoading?: boolean; silent?: boolean } = {}) => {
      if (!selectedDateId) {
        return;
      }
      setHasError(false);
      if (!silent) {
        if (showLoading) {
          setIsLoading(true);
        } else {
          setIsRefreshing(true);
        }
      }
      try {
        const data = await getMatchesByDate(selectedDateId);
        setMatches(data);
      } catch (error) {
        console.error('Failed to load matches', error);
        setMatches([]);
        setHasError(true);
      } finally {
        if (!silent) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [selectedDateId]
  );

  useEffect(() => {
    loadMatches({ showLoading: true });
  }, [loadMatches]);

  useFocusEffect(
    useCallback(() => {
      if (hasFocusedOnce.current) {
        loadMatches({ silent: true });
      } else {
        hasFocusedOnce.current = true;
      }
      const interval = setInterval(() => {
        loadMatches({ silent: true });
      }, 30000);
      return () => clearInterval(interval);
    }, [loadMatches])
  );

  const leagueOptions = useMemo(() => {
    const unique = new Map(matches.map((match) => [match.league.id, match.league]));
    return Array.from(unique.values()).sort((a, b) => a.name.localeCompare(b.name, locale));
  }, [matches, locale]);

  const countryOptions = useMemo(() => {
    const unique = new Set(matches.map((match) => match.league.country));
    return Array.from(unique.values()).sort((a, b) => a.localeCompare(b, locale));
  }, [matches, locale]);

  const visibleMatches = useMemo(() => {
    return matches.filter((match) => {
      const query = searchValue.toLowerCase();
      const matchesTeams =
        match.homeTeam.name.toLowerCase().includes(query) || match.awayTeam.name.toLowerCase().includes(query);

      const matchesLeague = selectedLeagueId ? match.league.id === selectedLeagueId : true;
      const matchesCountry = selectedCountry ? match.league.country === selectedCountry : true;

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
        matchesTime &&
        matchesStatus
      );
    });
  }, [
    matches,
    searchValue,
    selectedLeagueId,
    selectedCountry,
    selectedTimeSlot,
    selectedStatus,
  ]);

  const handleOpenMatch = (match: Match) => {
    router.push({ pathname: '/match-details', params: { matchId: match.id } });
  };

  const selectedLeagueLabel =
    leagueOptions.find((league) => league.id === selectedLeagueId)?.name ?? t('filterLeague');
  const selectedCountryLabel = selectedCountry ?? t('filterCountry');

  const isMatchFavorite = (matchId: string) => favoriteMatches.some((match) => match.id === matchId);

  useScrollToTop(listRef);

  const sections = useMemo<MatchSection[]>(() => {
    return [
      { key: 'calendar', data: [] },
      { key: 'matches', data: visibleMatches },
    ];
  }, [visibleMatches]);

  const renderChip = ({
    label,
    icon,
    active,
    activeColor,
    onPress,
  }: {
    label: string;
    icon?: keyof typeof MaterialCommunityIcons.glyphMap;
    active: boolean;
    activeColor: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.filterChip,
        {
          borderColor: border,
          backgroundColor: active ? activeColor : card,
        },
      ]}>
      {icon ? (
        <MaterialCommunityIcons name={icon} size={14} color={active ? '#FFFFFF' : mutedText} />
      ) : null}
      <ThemedText style={{ color: active ? '#FFFFFF' : mutedText }} numberOfLines={1}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <SectionList
        ref={listRef}
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item, section }) =>
          section.key === 'matches' ? (
            <MatchCard
              match={item}
              onPress={() => handleOpenMatch(item)}
              onToggleFavoriteMatch={toggleFavoriteMatch}
              isMatchFavorite={isMatchFavorite}
            />
          ) : null
        }
        renderSectionHeader={({ section }) =>
          section.key === 'calendar' ? (
            <View style={[styles.calendarHeader, { backgroundColor: background, borderBottomColor: border }]}>
              <ThemedText style={[styles.sectionTitle, { color: mutedText }]}>{t('calendar')}</ThemedText>
              <DateStrip dates={dates} selectedId={selectedDateId ?? dates[2].id} onSelect={setSelectedDateId} />
            </View>
          ) : null
        }
        stickySectionHeadersEnabled
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={loadMatches} tintColor={tint} />}
        ListHeaderComponent={
          <View>
            <View style={styles.headerRow}>
              <View style={styles.brandBlock}>
                <BrandTitle
                  accessibilityLabel={t('appName')}
                  numberOfLines={1}
                  style={styles.brandTitle}
                />
                <ThemedText
                  style={[styles.subtitle, { color: mutedText }]}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {t('headerMatchesSubtitle')}
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

            <View style={styles.searchRow}>
              <View style={[styles.searchBox, { backgroundColor: card, borderColor: border }]}>
                <MaterialCommunityIcons name="magnify" size={18} color={mutedText} />
                <TextInput
                  placeholder={t('searchPlaceholder')}
                  placeholderTextColor={mutedText}
                  value={searchValue}
                  onChangeText={setSearchValue}
                  style={[styles.searchInput, { color: text }]}
                />
              </View>
            </View>

            <View style={[styles.filterPanel, { backgroundColor: card, borderColor: border }]}> 
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled
                directionalLockEnabled
                contentContainerStyle={styles.filterRow}
                style={styles.filterScroll}>
                {renderChip({
                  label: selectedLeagueLabel,
                  icon: 'trophy-outline',
                  active: !!selectedLeagueId,
                  activeColor: tint,
                  onPress: () => setIsLeagueModalOpen(true),
                })}
                {renderChip({
                  label: selectedCountryLabel,
                  icon: 'earth',
                  active: !!selectedCountry,
                  activeColor: tint,
                  onPress: () => setIsCountryModalOpen(true),
                })}
                {renderChip({
                  label:
                    selectedTimeSlot === 'all'
                      ? t('filterTimeAll')
                      : selectedTimeSlot === 'morning'
                      ? t('filterTimeMorning')
                      : selectedTimeSlot === 'afternoon'
                      ? t('filterTimeAfternoon')
                      : t('filterTimeEvening'),
                  icon: 'clock-outline',
                  active: selectedTimeSlot !== 'all',
                  activeColor: tint,
                  onPress: () =>
                    setSelectedTimeSlot((prev) =>
                      prev === 'all' ? 'morning' : prev === 'morning' ? 'afternoon' : prev === 'afternoon' ? 'evening' : 'all'
                    ),
                })}
                {renderChip({
                  label: t('filterUpcoming'),
                  icon: 'calendar-check-outline',
                  active: selectedStatus === 'upcoming',
                  activeColor: tint,
                  onPress: () => setSelectedStatus((prev) => (prev === 'upcoming' ? 'all' : 'upcoming')),
                })}
                {renderChip({
                  label: t('filterLive'),
                  icon: 'access-point',
                  active: selectedStatus === 'live',
                  activeColor: danger,
                  onPress: () => setSelectedStatus((prev) => (prev === 'live' ? 'all' : 'live')),
                })}
                {renderChip({
                  label: t('filterFinished'),
                  icon: 'flag-checkered',
                  active: selectedStatus === 'finished',
                  activeColor: warning,
                  onPress: () => setSelectedStatus((prev) => (prev === 'finished' ? 'all' : 'finished')),
                })}
              </ScrollView>
            </View>
          </View>
        }
        ListFooterComponent={
          !isLoading ? (
            hasError ? (
              <View style={[styles.errorCard, { borderColor: border, backgroundColor: card }]}>
                <ThemedText type="defaultSemiBold">{t('errorMatchesTitle')}</ThemedText>
                <ThemedText style={{ color: mutedText }}>{t('errorMatchesSubtitle')}</ThemedText>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => loadMatches({ showLoading: true })}
                  style={[styles.retryButton, { borderColor: border }]}>
                  <ThemedText style={{ color: mutedText }}>{t('buttonRetry')}</ThemedText>
                </TouchableOpacity>
              </View>
            ) : visibleMatches.length === 0 ? (
              <View style={[styles.emptyCard, { borderColor: border, backgroundColor: card }]}>
                <ThemedText type="defaultSemiBold">{t('emptyMatchesTitle')}</ThemedText>
                <ThemedText style={{ color: mutedText }}>{t('emptyMatchesSubtitle')}</ThemedText>
              </View>
            ) : null
          ) : null
        }
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={8}
        contentInsetAdjustmentBehavior="never"
      />

      {isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={tint} />
          <ThemedText style={{ color: mutedText }}>{t('loadingMatches')}</ThemedText>
        </View>
      ) : null}

      <Modal animationType="slide" transparent visible={isLeagueModalOpen} onRequestClose={() => setIsLeagueModalOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setIsLeagueModalOpen(false)}>
          <View
            style={[styles.modalCard, { backgroundColor: card, borderColor: border }]}
            onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <ThemedText type="defaultSemiBold">{t('modalSelectLeague')}</ThemedText>
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
              <ThemedText style={{ color: mutedText }}>{t('modalAllLeagues')}</ThemedText>
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
              <ThemedText type="defaultSemiBold">{t('modalSelectCountry')}</ThemedText>
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
              <ThemedText style={{ color: mutedText }}>{t('modalAllCountries')}</ThemedText>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
  },
  headerRow: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
    position: 'relative',
  },
  brandBlock: {
    gap: 6,
    alignItems: 'center',
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
    position: 'absolute',
    right: 16,
  },
  subtitle: {
    textAlign: 'center',
  },
  divider: {
    height: 1,
    marginTop: 16,
    marginHorizontal: 16,
  },
  searchRow: {
    paddingHorizontal: 16,
    marginTop: 16,
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
  filterPanel: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    gap: 12,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingRight: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  calendarHeader: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  list: {
    paddingBottom: 140,
    gap: 12,
  },
  loadingState: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 220,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 6,
    marginHorizontal: 16,
    marginTop: 16,
  },
  errorCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  retryButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
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
