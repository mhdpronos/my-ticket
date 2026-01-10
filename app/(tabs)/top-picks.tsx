import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { useScrollToTop } from '@react-navigation/native';

import { MatchCard } from '@/components/matches/MatchCard';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getAllMatches } from '@/services/matchesService';
import { useAppStore } from '@/store/useAppStore';
import { Match } from '@/types';

export default function TopPicksScreen() {
  const [picks, setPicks] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const listRef = useRef<FlatList<Match>>(null);

  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');

  const favoriteMatches = useAppStore((state) => state.favoriteMatches);
  const toggleFavoriteMatch = useAppStore((state) => state.toggleFavoriteMatch);

  useEffect(() => {
    const loadPicks = async () => {
      const matches = await getAllMatches();
      setPicks(matches.slice(0, 6));
      setIsLoading(false);
    };

    loadPicks();
  }, []);

  const isMatchFavorite = (matchId: string) => favoriteMatches.some((match) => match.id === matchId);

  useScrollToTop(listRef);

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.header}>
        <View>
          <ThemedText type="title">Top picks</ThemedText>
          <ThemedText style={{ color: mutedText }}>
            Les meilleures sélections du jour pour préparer ton ticket.
          </ThemedText>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.push('/matches')}
          style={[styles.actionButton, { borderColor: border, backgroundColor: card }]}>
          <MaterialCommunityIcons name="soccer" size={18} color={mutedText} />
          <ThemedText style={{ color: mutedText }}>Matchs</ThemedText>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={tint} />
          <ThemedText style={{ color: mutedText }}>Chargement des picks...</ThemedText>
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
          ListEmptyComponent={
            <View style={[styles.emptyCard, { backgroundColor: card, borderColor: border }]}>
              <ThemedText type="defaultSemiBold">Aucune sélection</ThemedText>
              <ThemedText style={{ color: mutedText }}>
                Les meilleures sélections apparaîtront dès qu'elles seront disponibles.
              </ThemedText>
            </View>
          }
          showsVerticalScrollIndicator={false}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
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
