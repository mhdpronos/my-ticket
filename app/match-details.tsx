// Le code de la page qui affiche les détails avancés d'un match.
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

import { PredictionRow } from '@/components/matches/PredictionRow';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { getAllMatches } from '@/services/matchesService';
import { getPredictionsForMatch } from '@/services/predictionsService';
import { useAppStore } from '@/store/useAppStore';
import { Match, Prediction } from '@/types';
import { getLocale } from '@/utils/i18n';

export default function MatchDetailsScreen() {
  const { matchId } = useLocalSearchParams<{ matchId?: string | string[] }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const userAccess = useAppStore((state) => state.userAccess);
  const addTicketItem = useAppStore((state) => state.addTicketItem);

  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');
  const success = useThemeColor({}, 'success');
  const danger = useThemeColor({}, 'danger');
  const { t, language } = useTranslation();
  const locale = getLocale(language);

  const matchIdValue = Array.isArray(matchId) ? matchId[0] : matchId;

  useEffect(() => {
    const loadMatch = async () => {
      if (!matchIdValue) {
        setIsLoading(false);
        return;
      }
      const data = await getAllMatches();
      const foundMatch = data.find((item) => item.id === matchIdValue) ?? null;
      setMatch(foundMatch);
      if (foundMatch) {
        const predictionsData = await getPredictionsForMatch(foundMatch.id);
        setPredictions(predictionsData);
      }
      setIsLoading(false);
    };

    loadMatch();
  }, [matchIdValue]);

  const isPremium = userAccess.status === 'PREMIUM';
  const freePredictions = useMemo(() => predictions.filter((prediction) => prediction.tier === 'free'), [predictions]);
  const premiumPredictions = useMemo(
    () => predictions.filter((prediction) => prediction.tier === 'premium'),
    [predictions]
  );
  const visiblePredictions = isPremium ? [...freePredictions, ...premiumPredictions] : freePredictions;

  if (isLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: background }]}>
        <ActivityIndicator size="large" color={tint} />
        <ThemedText style={{ color: mutedText }}>{t('loadingMatch')}</ThemedText>
      </View>
    );
  }

  if (!match) {
    return (
      <View style={[styles.loading, { backgroundColor: background }]}>
        <ThemedText type="defaultSemiBold">{t('matchNotFound')}</ThemedText>
        <ThemedText style={{ color: mutedText }}>{t('matchNotFoundSubtitle')}</ThemedText>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.back()}
          style={[styles.backHomeButton, { borderColor: border }]}>
          <ThemedText style={{ color: mutedText }}>{t('buttonBack')}</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  const scoreLabel = match.score ? `${match.score.home} : ${match.score.away}` : t('matchScoreFallback');
  const winRate = match.winRate;

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ScreenHeader title={t('matchDetailsTitle')} subtitle={match.league.name} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.matchCard, { backgroundColor: card, borderColor: border }]}>
          <View style={styles.matchHeader}>
            <View style={styles.teamColumn}>
              <Image source={{ uri: match.homeTeam.logoUrl }} style={styles.logo} contentFit="contain" />
              <ThemedText type="defaultSemiBold">{match.homeTeam.name}</ThemedText>
            </View>
            <View style={styles.scoreColumn}>
              <ThemedText type="title" style={{ color: tint }}>
                {scoreLabel}
              </ThemedText>
              <ThemedText style={{ color: mutedText }}>
                {match.status === 'live'
                  ? t('matchStatusLive', { minute: match.liveMinute ?? 0 })
                  : match.status === 'finished'
                  ? t('matchStatusFinished')
                  : t('matchStatusUpcoming')}
              </ThemedText>
              <ThemedText style={{ color: mutedText }}>
                {new Date(match.kickoffIso).toLocaleString(locale)}
              </ThemedText>
            </View>
            <View style={styles.teamColumn}>
              <Image source={{ uri: match.awayTeam.logoUrl }} style={styles.logo} contentFit="contain" />
              <ThemedText type="defaultSemiBold">{match.awayTeam.name}</ThemedText>
            </View>
          </View>
          <View style={styles.metaRow}>
            <ThemedText style={{ color: mutedText }}>{match.venue ?? t('matchVenueFallback')}</ThemedText>
            <ThemedText style={{ color: mutedText }}>{match.league.country}</ThemedText>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <View style={styles.cardHeader}>
            <ThemedText type="defaultSemiBold">{t('predictions')}</ThemedText>
            <ThemedText style={{ color: mutedText }}>
              {isPremium ? t('predictionsPremium') : t('predictionsFree')}
            </ThemedText>
          </View>
          {visiblePredictions.length === 0 ? (
            <ThemedText style={{ color: mutedText }}>{t('predictionsLoading')}</ThemedText>
          ) : (
            visiblePredictions.map((prediction) => (
              <PredictionRow
                key={prediction.id}
                prediction={prediction}
                locked={prediction.tier === 'premium' && !isPremium}
                onAdd={() => addTicketItem(match, prediction)}
              />
            ))
          )}
        </View>

        {winRate && (
          <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
            <ThemedText type="defaultSemiBold">{t('estimatedSuccessRate')}</ThemedText>
            <View style={styles.rateRow}>
              <ThemedText style={{ color: winRate.home >= 60 ? success : danger }}>
                {match.homeTeam.name} {winRate.home}%
              </ThemedText>
              <ThemedText style={{ color: mutedText }}>{winRate.draw}% {t('drawLabel')}</ThemedText>
              <ThemedText style={{ color: winRate.away >= 60 ? success : danger }}>
                {match.awayTeam.name} {winRate.away}%
              </ThemedText>
            </View>
          </View>
        )}

        {!isPremium && (
          <View style={[styles.premiumBanner, { borderColor: border, backgroundColor: card }]}>
            <ThemedText type="defaultSemiBold">{t('premiumTitle')}</ThemedText>
            <ThemedText style={{ color: mutedText }}>{t('premiumDescription')}</ThemedText>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => router.push('/subscription')}
              style={[styles.upgradeButton, { backgroundColor: tint }]}>
              <ThemedText style={styles.upgradeButtonText}>{t('buttonUpgrade')}</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
  },
  backHomeButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  matchCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    gap: 12,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  teamColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  scoreColumn: {
    alignItems: 'center',
    gap: 4,
  },
  logo: {
    width: 42,
    height: 42,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  premiumBanner: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  upgradeButton: {
    marginTop: 4,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
