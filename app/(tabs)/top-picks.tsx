import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getAllMatches } from '@/services/matchesService';
import { getPredictionsForMatch } from '@/services/predictionsService';
import { Match, Prediction } from '@/types';

type TopPick = {
  match: Match;
  prediction: Prediction;
};

export default function TopPicksScreen() {
  const [picks, setPicks] = useState<TopPick[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');

  useEffect(() => {
    const loadPicks = async () => {
      const matches = await getAllMatches();
      const selectedMatches = matches.slice(0, 6);
      const picksData = await Promise.all(
        selectedMatches.map(async (match) => {
          const predictions = await getPredictionsForMatch(match.id);
          const prediction = predictions.find((item) => item.tier === 'free') ?? predictions[0];
          return { match, prediction };
        })
      );
      setPicks(picksData);
      setIsLoading(false);
    };

    loadPicks();
  }, []);

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
          data={picks}
          keyExtractor={(item) => item.match.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              accessibilityRole="button"
              style={[styles.pickCard, { backgroundColor: card, borderColor: border }]}
              onPress={() => router.push({ pathname: '/match-details', params: { matchId: item.match.id } })}>
              <View style={styles.pickHeader}>
                <ThemedText type="defaultSemiBold">{item.match.league.name}</ThemedText>
                <MaterialCommunityIcons name="chevron-right" size={18} color={mutedText} />
              </View>
              <ThemedText style={{ color: mutedText }}>
                {item.match.homeTeam.name} • {item.match.awayTeam.name}
              </ThemedText>
              <View style={[styles.predictionPill, { borderColor: border }]}>
                <ThemedText style={{ color: mutedText }}>{item.prediction.label}</ThemedText>
              </View>
            </TouchableOpacity>
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
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
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
  pickCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  pickHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  predictionPill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
});
