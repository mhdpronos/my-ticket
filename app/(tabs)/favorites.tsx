import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useRef, useState } from 'react';
import { useScrollToTop } from '@react-navigation/native';
import { router } from 'expo-router';

import { MatchCard } from '@/components/matches/MatchCard';
import { ThemedText } from '@/components/ui/ThemedText';
import { useHapticOnScroll } from '@/hooks/useHapticOnScroll';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { Match } from '@/types';

export default function FavoritesScreen() {
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');
  const listRef = useRef<FlatList<Match>>(null);
  const { t } = useTranslation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollHaptics = useHapticOnScroll();

  const favoriteMatches = useAppStore((state) => state.favoriteMatches);
  const toggleFavoriteMatch = useAppStore((state) => state.toggleFavoriteMatch);

  const isMatchFavorite = (matchId: string) => favoriteMatches.some((match) => match.id === matchId);

  const refreshFavorites = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    setIsRefreshing(false);
  }, []);

  useScrollToTop(listRef);

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.header}>
        <ThemedText type="pageTitle">{t('tabsFavorites')}</ThemedText>
        <ThemedText style={[styles.subtitle, { color: mutedText }]}>{t('headerFavoritesSubtitle')}</ThemedText>
      </View>

      <FlatList
        ref={listRef}
        data={favoriteMatches}
        keyExtractor={(item) => item.id}
        {...scrollHaptics}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <MatchCard
            match={item}
            onPress={() => router.push({ pathname: '/match-details', params: { matchId: item.id } })}
            onToggleFavoriteMatch={toggleFavoriteMatch}
            isMatchFavorite={isMatchFavorite}
          />
        )}
        ListEmptyComponent={
          <View style={[styles.emptyStateCard, { borderColor: border, backgroundColor: card }]}>
            <MaterialCommunityIcons name="star-circle-outline" size={48} color={mutedText} />
            <ThemedText type="defaultSemiBold">{t('favoritesEmptyTitle')}</ThemedText>
            <ThemedText style={{ color: mutedText }}>{t('favoritesEmptySubtitle')}</ThemedText>
          </View>
        }
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refreshFavorites} tintColor={tint} />}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
    gap: 16,
  },
  header: {
    gap: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  list: {
    gap: 12,
    paddingBottom: 20,
  },
  emptyStateCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginHorizontal: 16,
  },
});
