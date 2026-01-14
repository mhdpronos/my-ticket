import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  const loadPicks = useCallback(
    async ({ showLoading }: { showLoading?: boolean } = {}) => {
      if (showLoading) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      const { matches, error } = await getAllMatches();
      setPicks(matches.slice(0, 6));
      setErrorMessage(error);
      setIsLoading(false);
      setIsRefreshing(false);
    },
    []
  );

  useEffect(() => {
    loadPicks({ showLoading: true });
  }, [loadPicks]);

  useFocusEffect(
    useCallback(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
      if (!hasFocusedOnce.current) {
        hasFocusedOnce.current = true;
        return;
      }
      loadPicks();
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
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.push('/matches')}
          style={[styles.actionButton, { borderColor: border, backgroundColor: card }]}>
          <MaterialCommunityIcons name="soccer" size={18} color={mutedText} />
          <ThemedText style={{ color: mutedText }}>{t('buttonMatches')}</ThemedText>
        </TouchableOpacity>
      </View>
      {errorMessage ? (
        <View style={[styles.errorCard, { backgroundColor: card, borderColor: border }]}>
          <ThemedText type="defaultSemiBold">{t('apiErrorTitle')}</ThemedText>
          <ThemedText style={{ color: mutedText }}>
            {t('apiErrorSubtitle', { message: errorMessage || t('apiErrorUnknown') })}
          </ThemedText>
        </View>
      ) : null}

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
            !errorMessage ? (
              <View style={[styles.emptyCard, { backgroundColor: card, borderColor: border }]}>
                <ThemedText type="defaultSemiBold">{t('topPicksEmptyTitle')}</ThemedText>
                <ThemedText style={{ color: mutedText }}>{t('topPicksEmptySubtitle')}</ThemedText>
              </View>
            ) : null
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    position: 'absolute',
    right: 16,
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
  errorCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 6,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
});
