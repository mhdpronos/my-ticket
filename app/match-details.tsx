// Le code de la page qui affiche les détails avancés d'un match.
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { PredictionRow } from '@/components/matches/PredictionRow';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedText } from '@/components/ui/ThemedText';
import { useHapticOnScroll } from '@/hooks/useHapticOnScroll';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { getMatchById } from '@/services/matchesService';
import { getPredictionsForMatch } from '@/services/predictionsService';
import { useAppStore } from '@/store/useAppStore';
import { Match, Prediction } from '@/types';
import { getLocale } from '@/utils/i18n';

export default function MatchDetailsScreen() {
  const { matchId } = useLocalSearchParams<{ matchId?: string | string[] }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasFocusedOnce = useRef(false);

  const userAccess = useAppStore((state) => state.userAccess);
  const addTicketItem = useAppStore((state) => state.addTicketItem);
  const ticketItems = useAppStore((state) => state.ticketItems);

  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');
  const success = useThemeColor({}, 'success');
  const danger = useThemeColor({}, 'danger');
  const { t, language } = useTranslation();
  const locale = getLocale(language);
  const scrollHaptics = useHapticOnScroll();

  const matchIdValue = Array.isArray(matchId) ? matchId[0] : matchId;

  const loadMatch = useCallback(
    async ({ showLoading, silent }: { showLoading?: boolean; silent?: boolean } = {}) => {
      if (!matchIdValue) {
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }
      if (!silent) {
        if (showLoading) {
          setIsLoading(true);
        } else {
          setIsRefreshing(true);
        }
      }
      try {
        const foundMatch = await getMatchById(matchIdValue);
        setMatch(foundMatch);
        if (foundMatch) {
          const predictionsData = await getPredictionsForMatch(foundMatch.id);
          setPredictions(predictionsData);
        } else {
          setPredictions([]);
        }
      } catch (error) {
        console.error('Failed to load match details', error);
        setMatch(null);
        setPredictions([]);
      } finally {
        if (!silent) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [matchIdValue]
  );

  useEffect(() => {
    loadMatch({ showLoading: true });
  }, [loadMatch]);

  useFocusEffect(
    useCallback(() => {
      if (hasFocusedOnce.current) {
        loadMatch({ silent: true });
      } else {
        hasFocusedOnce.current = true;
      }
      const interval = setInterval(() => {
        loadMatch({ silent: true });
      }, 30000);
      return () => clearInterval(interval);
    }, [loadMatch])
  );

  const isPremium = userAccess.status === 'PREMIUM';
  const freePredictions = useMemo(
    () =>
      predictions
        .filter((prediction) => prediction.tier === 'free' && (prediction.odds ?? 0) <= 1.3)
        .slice(0, 6),
    [predictions]
  );
  const premiumPredictions = useMemo(
    () =>
      predictions
        .filter(
          (prediction) =>
            prediction.tier === 'premium' &&
            (prediction.odds ?? 0) >= 1.4 &&
            (prediction.odds ?? 0) <= 2
        )
        .slice(0, 6),
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
  const predictionWinRate = predictions.reduce(
    (acc, prediction) => {
      if (prediction.market !== '1X2' || prediction.confidence === undefined) {
        return acc;
      }
      if (prediction.selection === 'HOME') {
        acc.home = prediction.confidence;
      } else if (prediction.selection === 'DRAW') {
        acc.draw = prediction.confidence;
      } else if (prediction.selection === 'AWAY') {
        acc.away = prediction.confidence;
      }
      return acc;
    },
    { home: 0, draw: 0, away: 0 }
  );
  const hasPredictionRates =
    predictionWinRate.home + predictionWinRate.draw + predictionWinRate.away > 0;
  const winRate = match.winRate ?? (hasPredictionRates ? predictionWinRate : null);

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ScreenHeader title={t('matchDetailsTitle')} subtitle={match.league.name} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={loadMatch} tintColor={tint} />}
        contentInsetAdjustmentBehavior="never"
        {...scrollHaptics}>
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

        {winRate && (
          <View style={[styles.rateCardWrapper, { backgroundColor: card, borderColor: border }]}>
            <ThemedText type="defaultSemiBold">{t('estimatedSuccessRate')}</ThemedText>
            <View style={styles.rateCardRow}>
              <View
                style={[
                  styles.rateCard,
                  {
                    backgroundColor: winRate.home >= 60 ? success : danger,
                    borderColor: winRate.home >= 60 ? success : danger,
                  },
                ]}>
                <Image source={{ uri: match.homeTeam.logoUrl }} style={styles.rateLogo} contentFit="contain" />
                <ThemedText type="defaultSemiBold" style={styles.rateValue}>
                  {winRate.home}%
                </ThemedText>
              </View>
              <View
                style={[
                  styles.rateCard,
                  {
                    backgroundColor: winRate.away >= 60 ? success : danger,
                    borderColor: winRate.away >= 60 ? success : danger,
                  },
                ]}>
                <Image source={{ uri: match.awayTeam.logoUrl }} style={styles.rateLogo} contentFit="contain" />
                <ThemedText type="defaultSemiBold" style={styles.rateValue}>
                  {winRate.away}%
                </ThemedText>
              </View>
            </View>
          </View>
        )}

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
                oddsLabel={prediction.odds ? prediction.odds.toFixed(2) : undefined}
                isAdded={ticketItems.some(
                  (item) => item.match.id === match.id && item.prediction.id === prediction.id
                )}
              />
            ))
          )}
        </View>

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
    borderRadius: 18,
    padding: 18,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
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
    borderRadius: 18,
    padding: 18,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateCardWrapper: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  rateCardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  rateCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 8,
  },
  rateLogo: {
    width: 34,
    height: 34,
  },
  rateValue: {
    color: '#FFFFFF',
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
