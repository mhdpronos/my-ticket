import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useRef, useState } from 'react';
import { useScrollToTop } from '@react-navigation/native';
import { router } from 'expo-router';

import { MatchCard } from '@/components/matches/MatchCard';
import { ThemedText } from '@/components/ui/ThemedText';
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

  const favoriteMatches = useAppStore((state) => state.favoriteMatches);
  const toggleFavoriteMatch = useAppStore((state) => state.toggleFavoriteMatch);

  const isMatchFavorite = (matchId: string) => favoriteMatches.some((match) => match.id === matchId);
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    requestAnimationFrame(() => setIsRefreshing(false));
  }, []);

  useScrollToTop(listRef);

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.header}>
        <View style={[styles.titleBar, { backgroundColor: tint }]}>
          <ThemedText type="title" style={styles.titleText}>
            {t('tabsFavorites')}
          </ThemedText>
        </View>
        <ThemedText style={[styles.subtitleText, { color: mutedText }]}>{t('headerFavoritesSubtitle')}</ThemedText>
      </View>

      <FlatList
        ref={listRef}
        data={favoriteMatches}
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
        ListEmptyComponent={
          <View style={[styles.emptyStateCard, { borderColor: border, backgroundColor: card }]}>
            <MaterialCommunityIcons name="star-circle-outline" size={48} color={mutedText} />
            <ThemedText type="defaultSemiBold">{t('favoritesEmptyTitle')}</ThemedText>
            <ThemedText style={{ color: mutedText }}>{t('favoritesEmptySubtitle')}</ThemedText>
          </View>
        }
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={tint} />}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
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
  },
  titleBar: {
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitleText: {
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
