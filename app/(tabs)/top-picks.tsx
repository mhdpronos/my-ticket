import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';

import { MatchCard } from '@/components/matches/MatchCard';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { getAllMatches } from '@/services/matchesService';
import { useAppStore } from '@/store/useAppStore';
import { Match } from '@/types';

export default function TopPicksScreen() {
  const [picks, setPicks] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const listRef = useRef<FlatList<Match>>(null);
  const hasFocusedOnce = useRef(false);

  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');
  const { t } = useTranslation();

  const favoriteMatches = useAppStore((state) => state.favoriteMatches);
  const toggleFavoriteMatch = useAppStore((state) => state.toggleFavoriteMatch);

  const featuredTeams = useRef([
    'barcelona',
    'real madrid',
    'manchester city',
    'man city',
    'manchester united',
    'man united',
    'paris saint-germain',
    'psg',
    'bayern',
    'liverpool',
    'arsenal',
    'chelsea',
    'tottenham',
    'juventus',
    'ac milan',
    'inter',
    'barca',
    'atletico madrid',
    'borussia dortmund',
    'napoli',
  ]);

  const normalizeName = useCallback((name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }, []);

  const isFeaturedMatch = useCallback(
    (match: Match) => {
      const home = normalizeName(match.homeTeam.name);
      const away = normalizeName(match.awayTeam.name);
      return featuredTeams.current.some((team) => home.includes(team) || away.includes(team));
    },
    [normalizeName]
  );

  const loadPicks = useCallback(
    async ({ showLoading, silent }: { showLoading?: boolean; silent?: boolean } = {}) => {
      if (!silent) {
        if (showLoading) {
          setIsLoading(true);
        } else {
          setIsRefreshing(true);
        }
      }
      try {
        const matches = await getAllMatches();
        const featured = matches.filter(isFeaturedMatch);
        setPicks(featured.slice(0, 6));
      } catch (error) {
        console.error('Failed to load top picks', error);
        setPicks([]);
      } finally {
        if (!silent) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [isFeaturedMatch]
  );

  useEffect(() => {
    loadPicks({ showLoading: true });
  }, [loadPicks]);

  useFocusEffect(
    useCallback(() => {
      if (hasFocusedOnce.current) {
        loadPicks({ silent: true });
      } else {
        hasFocusedOnce.current = true;
      }
      const interval = setInterval(() => {
        loadPicks({ silent: true });
      }, 30000);
      return () => clearInterval(interval);
    }, [loadPicks])
  );

  const isMatchFavorite = (matchId: string) => favoriteMatches.some((match) => match.id === matchId);

  useScrollToTop(listRef);

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <ThemedText type="pageTitle">{t('tabsTopPicks')}</ThemedText>
          <ThemedText style={[styles.subtitle, { color: mutedText }]}>{t('headerTopPicksSubtitle')}</ThemedText>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={tint} />
          <ThemedText style={{ color: mutedText }}>{t('topPicksLoading')}</ThemedText>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={picks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <MatchCard
              match={item}
              onPress={() => router.push({ pathname: '/match-details', params: { matchId: item.id } })}
              onToggleFavoriteMatch={toggleFavoriteMatch}
              isMatchFavorite={isMatchFavorite}
            />
          )}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={loadPicks} tintColor={tint} />}
          ListEmptyComponent={
            <View style={[styles.emptyCard, { backgroundColor: card, borderColor: border }]}>
              <ThemedText type="defaultSemiBold">{t('topPicksEmptyTitle')}</ThemedText>
              <ThemedText style={{ color: mutedText }}>{t('topPicksEmptySubtitle')}</ThemedText>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="never"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
  },
  header: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  headerText: {
    alignItems: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  list: {
    gap: 12,
    paddingBottom: 40,
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 6,
    marginHorizontal: 16,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
});
