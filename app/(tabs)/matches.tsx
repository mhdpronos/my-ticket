import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BottomSheet } from '@/components/BottomSheet';
import { DateStrip } from '@/components/DateStrip';
import { EmptyState } from '@/components/EmptyState';
import { FilterChips } from '@/components/FilterChips';
import { LoadingState } from '@/components/LoadingState';
import { MatchCard } from '@/components/MatchCard';
import { PredictionRow } from '@/components/PredictionRow';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SearchBar } from '@/components/SearchBar';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { matchesService } from '@/services/matchesService';
import { predictionsService } from '@/services/predictionsService';
import { useDateStore } from '@/store/dateStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useTicketStore } from '@/store/ticketStore';
import { useUserStore } from '@/store/userStore';
import type { Match } from '@/types/match';
import type { Prediction, RiskLevel } from '@/types/prediction';

export default function MatchesScreen() {
  const router = useRouter();
  const { selectedDate, setSelectedDate } = useDateStore();
  const { isFavoriteTeam, isFavoriteLeague, toggleTeam, toggleLeague } = useFavoritesStore();
  const { addItem } = useTicketStore();
  const { user } = useUserStore();

  const [search, setSearch] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [riskLevel, setRiskLevel] = useState<RiskLevel | 'ALL'>('ALL');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 150);
    return () => clearTimeout(timer);
  }, [favoritesOnly, riskLevel, search, selectedDate]);

  const matches = useMemo(() => {
    const dateParts = selectedDate.split('-');
    const date = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
    return matchesService.getMatchesForDate(date, 50);
  }, [selectedDate]);

  const matchesWithRisk = useMemo(() => {
    return matches.map((match) => {
      const predictions = predictionsService.getPredictionsByMatch(match.id);
      return {
        match,
        risk: predictions[0]?.riskLevel ?? 'SAFE',
      };
    });
  }, [matches]);

  const filteredMatches = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = matchesWithRisk.filter(({ match, risk }) => {
      const isFavorite =
        isFavoriteTeam(match.homeTeam.id) ||
        isFavoriteTeam(match.awayTeam.id) ||
        isFavoriteLeague(match.league.id);

      if (favoritesOnly && !isFavorite) {
        return false;
      }

      if (riskLevel !== 'ALL' && risk !== riskLevel) {
        return false;
      }

      if (query.length > 0) {
        const haystack = `${match.homeTeam.name} ${match.awayTeam.name} ${match.league.name}`.toLowerCase();
        return haystack.includes(query);
      }

      return true;
    });

    const sorted = filtered.sort((a, b) => {
      const aFavorite =
        isFavoriteTeam(a.match.homeTeam.id) ||
        isFavoriteTeam(a.match.awayTeam.id) ||
        isFavoriteLeague(a.match.league.id);
      const bFavorite =
        isFavoriteTeam(b.match.homeTeam.id) ||
        isFavoriteTeam(b.match.awayTeam.id) ||
        isFavoriteLeague(b.match.league.id);
      if (aFavorite === bFavorite) {
        return a.match.time.localeCompare(b.match.time);
      }
      return aFavorite ? -1 : 1;
    });

    return sorted;
  }, [favoritesOnly, isFavoriteLeague, isFavoriteTeam, matchesWithRisk, riskLevel, search]);

  const handleSelectMatch = (match: Match) => {
    setSelectedMatch(match);
  };

  const handleAddToTicket = (prediction: Prediction) => {
    addItem({
      id: `${prediction.matchId}-${prediction.id}`,
      matchId: prediction.matchId,
      predictionId: prediction.id,
    });
  };

  const predictions = selectedMatch ? predictionsService.getPredictionsByMatch(selectedMatch.id) : [];
  const freePredictions = predictions.filter((prediction) => !prediction.isPremium);
  const premiumPredictions = predictions.filter((prediction) => prediction.isPremium);
  const visiblePremium = user.access === 'PREMIUM' ? premiumPredictions : [];

  return (
    <ScreenContainer>
      <Text style={styles.title}>Matchs</Text>
      <Text style={styles.subtitle}>Crée ton ticket. Compare les cotes. Parie où tu veux.</Text>

      <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />

      <SearchBar value={search} onChange={setSearch} />

      <FilterChips
        favoritesOnly={favoritesOnly}
        riskLevel={riskLevel}
        onToggleFavorites={() => setFavoritesOnly((prev) => !prev)}
        onSelectRisk={setRiskLevel}
      />

      {isLoading ? (
        <LoadingState label="Chargement des matchs..." />
      ) : (
        <FlatList
          data={filteredMatches}
          keyExtractor={(item) => item.match.id}
          initialNumToRender={12}
          windowSize={7}
          removeClippedSubviews
          renderItem={({ item }) => (
            <MatchCard
              match={item.match}
              riskLabel={item.risk}
              isFavorite={
                isFavoriteTeam(item.match.homeTeam.id) ||
                isFavoriteTeam(item.match.awayTeam.id) ||
                isFavoriteLeague(item.match.league.id)
              }
              onToggleFavorite={() => toggleLeague(item.match.league.id)}
              onPress={() => handleSelectMatch(item.match)}
            />
          )}
          ListEmptyComponent={
            <EmptyState title="Aucun match" subtitle="Changez les filtres ou la date." />
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      <BottomSheet visible={Boolean(selectedMatch)} onClose={() => setSelectedMatch(null)}>
        {selectedMatch ? (
          <View style={styles.sheetContent}>
            <Text style={styles.sheetTitle}>
              {selectedMatch.homeTeam.name} vs {selectedMatch.awayTeam.name}
            </Text>
            <Text style={styles.sheetSubtitle}>{selectedMatch.league.name}</Text>
            <View style={styles.favoriteRow}>
              <Pressable
                style={styles.favoriteButton}
                onPress={() => toggleTeam(selectedMatch.homeTeam.id)}
              >
                <Text style={styles.favoriteButtonText}>
                  {isFavoriteTeam(selectedMatch.homeTeam.id) ? 'Retirer' : 'Favori'} {selectedMatch.homeTeam.shortName}
                </Text>
              </Pressable>
              <Pressable
                style={styles.favoriteButton}
                onPress={() => toggleTeam(selectedMatch.awayTeam.id)}
              >
                <Text style={styles.favoriteButtonText}>
                  {isFavoriteTeam(selectedMatch.awayTeam.id) ? 'Retirer' : 'Favori'} {selectedMatch.awayTeam.shortName}
                </Text>
              </Pressable>
              <Pressable
                style={styles.favoriteButton}
                onPress={() => toggleLeague(selectedMatch.league.id)}
              >
                <Text style={styles.favoriteButtonText}>
                  {isFavoriteLeague(selectedMatch.league.id) ? 'Retirer' : 'Favori'} {selectedMatch.league.name}
                </Text>
              </Pressable>
            </View>

            <Text style={styles.sectionTitle}>Pronostics gratuits</Text>
            <View style={styles.predictions}>
              {freePredictions.map((prediction) => (
                <PredictionRow
                  key={prediction.id}
                  prediction={prediction}
                  onAddToTicket={() => handleAddToTicket(prediction)}
                />
              ))}
            </View>

            <Text style={styles.sectionTitle}>Pronostics premium</Text>
            {user.access === 'PREMIUM' ? (
              <View style={styles.predictions}>
                {visiblePremium.map((prediction) => (
                  <PredictionRow
                    key={prediction.id}
                    prediction={prediction}
                    onAddToTicket={() => handleAddToTicket(prediction)}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.lockedBox}>
                <Text style={styles.lockedText}>Débloque 3 pronos premium supplémentaires.</Text>
                <Pressable style={styles.premiumButton} onPress={() => router.push('/subscription')}>
                  <Text style={styles.premiumButtonText}>Passer Premium</Text>
                </Pressable>
              </View>
            )}
          </View>
        ) : null}
      </BottomSheet>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: '700',
    marginTop: Spacing.md,
  },
  subtitle: {
    color: Colors.dark.muted,
    marginBottom: Spacing.sm,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
  sheetContent: {
    gap: Spacing.sm,
  },
  sheetTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '700',
  },
  sheetSubtitle: {
    color: Colors.dark.muted,
  },
  sectionTitle: {
    color: Colors.dark.accentSoft,
    fontWeight: '700',
    marginTop: Spacing.sm,
  },
  predictions: {
    borderRadius: Radius.md,
    backgroundColor: Colors.dark.card,
    paddingHorizontal: Spacing.md,
  },
  lockedBox: {
    backgroundColor: Colors.dark.card,
    padding: Spacing.md,
    borderRadius: Radius.md,
    gap: Spacing.sm,
  },
  favoriteRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  favoriteButton: {
    backgroundColor: Colors.dark.card,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  favoriteButtonText: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: '600',
  },
  lockedText: {
    color: Colors.dark.muted,
  },
  premiumButton: {
    backgroundColor: Colors.dark.accent,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  premiumButtonText: {
    color: Colors.dark.background,
    fontWeight: '700',
  },
});
