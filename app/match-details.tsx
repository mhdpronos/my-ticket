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
import { getMatchInsights, MatchInsights } from '@/services/matchInsightsService';
import { getMatchById } from '@/services/matchesService';
import { getPredictionsForMatch } from '@/services/predictionsService';
import { useAppStore } from '@/store/useAppStore';
import { Match, Prediction } from '@/types';
import { getLocale } from '@/utils/i18n';

export default function MatchDetailsScreen() {
  const { matchId } = useLocalSearchParams<{ matchId?: string | string[] }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [insights, setInsights] = useState<MatchInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);
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
  const backgroundSecondary = useThemeColor({}, 'backgroundSecondary');
  const { t, language } = useTranslation();
  const locale = getLocale(language);
  const scrollHaptics = useHapticOnScroll();

  const matchIdValue = Array.isArray(matchId) ? matchId[0] : matchId;

  const loadMatch = useCallback(
    async ({
      showLoading,
      silent,
      forceRefresh,
    }: {
      showLoading?: boolean;
      silent?: boolean;
      forceRefresh?: boolean;
    } = {}) => {
      if (!matchIdValue) {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsInsightsLoading(false);
        return;
      }
      if (!silent) {
        if (showLoading) {
          setIsLoading(true);
        } else {
          setIsRefreshing(true);
        }
      }
      setIsInsightsLoading(true);
      try {
        const foundMatch = await getMatchById(matchIdValue, { forceRefresh });
        setMatch(foundMatch);
        if (foundMatch) {
          const [predictionsData, insightsData] = await Promise.all([
            getPredictionsForMatch(foundMatch.id, { forceRefresh }),
            getMatchInsights(foundMatch, { forceRefresh }),
          ]);
          setPredictions(predictionsData);
          setInsights(insightsData);
        } else {
          setPredictions([]);
          setInsights(null);
        }
      } catch (error) {
        console.error('Failed to load match details', error);
        setMatch(null);
        setPredictions([]);
        setInsights(null);
      } finally {
        if (!silent) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
        setIsInsightsLoading(false);
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
  const kickoffTimeLabel = new Date(match.kickoffIso).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
  const rateThreshold = 50;
  const getRateTone = (value: number) => (value >= rateThreshold ? success : danger);
  const emptyLabel = t('noDataAvailable');

  const formatShortDate = (dateIso: string) =>
    new Date(dateIso).toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
    });

  const renderEmpty = (label = emptyLabel) => (
    <ThemedText style={{ color: mutedText }}>{label}</ThemedText>
  );

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ScreenHeader title={t('matchDetailsTitle')} subtitle={match.league.name} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadMatch({ forceRefresh: true })}
            tintColor={tint}
          />
        }
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
              <View style={[styles.timePill, { backgroundColor: backgroundSecondary, borderColor: border }]}>
                <ThemedText type="defaultSemiBold" style={{ color: tint }}>
                  {kickoffTimeLabel}
                </ThemedText>
              </View>
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
                    backgroundColor: getRateTone(winRate.home),
                    borderColor: getRateTone(winRate.home),
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
                    backgroundColor: getRateTone(winRate.draw),
                    borderColor: getRateTone(winRate.draw),
                  },
                ]}>
                <ThemedText type="defaultSemiBold" style={styles.rateLabel}>
                  {t('drawLabel')}
                </ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.rateValue}>
                  {winRate.draw}%
                </ThemedText>
              </View>
              <View
                style={[
                  styles.rateCard,
                  {
                    backgroundColor: getRateTone(winRate.away),
                    borderColor: getRateTone(winRate.away),
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

        {isInsightsLoading && (
          <View style={[styles.sectionCard, { backgroundColor: card, borderColor: border }]}>
            <ActivityIndicator size="small" color={tint} />
            <ThemedText style={{ color: mutedText }}>{t('loadingInsights')}</ThemedText>
          </View>
        )}

        {insights && (
          <>
            <View style={[styles.sectionCard, { backgroundColor: card, borderColor: border }]}>
              <View style={styles.sectionHeader}>
                <ThemedText type="defaultSemiBold">{t('standingsTitle')}</ThemedText>
                <ThemedText style={{ color: mutedText }}>{match.league.name}</ThemedText>
              </View>
              {insights.standings.length === 0
                ? renderEmpty()
                : insights.standings.slice(0, 8).map((row) => {
                    const isHighlighted =
                      row.team.id === match.homeTeam.id || row.team.id === match.awayTeam.id;
                    return (
                      <View
                        key={row.team.id}
                        style={[
                          styles.standingRow,
                          isHighlighted && { backgroundColor: backgroundSecondary, borderColor: border },
                        ]}>
                        <ThemedText style={styles.standingRank}>{row.rank}</ThemedText>
                        <Image source={{ uri: row.team.logoUrl }} style={styles.standingLogo} contentFit="contain" />
                        <View style={styles.standingTeamInfo}>
                          <ThemedText type="defaultSemiBold">{row.team.name}</ThemedText>
                          <ThemedText style={{ color: mutedText }}>
                            {t('standingsPlayedLabel', { count: row.played })} ·{' '}
                            {t('standingsPointsLabel', { count: row.points })}
                          </ThemedText>
                        </View>
                        <ThemedText style={styles.standingGoalDiff}>{row.goalDiff}</ThemedText>
                      </View>
                    );
                  })}
            </View>

            <View style={[styles.sectionCard, { backgroundColor: card, borderColor: border }]}>
              <View style={styles.sectionHeader}>
                <ThemedText type="defaultSemiBold">{t('recentFixturesTitle')}</ThemedText>
                <ThemedText style={{ color: mutedText }}>{t('recentFixturesSubtitle')}</ThemedText>
              </View>
              {insights.recentFixtures.length === 0
                ? renderEmpty()
                : insights.recentFixtures.map((group) => (
                    <View key={group.team.id} style={styles.subSection}>
                      <View style={styles.teamHeaderRow}>
                        <Image source={{ uri: group.team.logoUrl }} style={styles.teamBadge} contentFit="contain" />
                        <ThemedText type="defaultSemiBold">{group.team.name}</ThemedText>
                      </View>
                      {group.fixtures.length === 0 ? (
                        renderEmpty()
                      ) : (
                        group.fixtures.map((fixture) => (
                          <View key={fixture.id} style={styles.fixtureRow}>
                            <ThemedText style={{ color: mutedText }}>{formatShortDate(fixture.dateIso)}</ThemedText>
                            <ThemedText style={styles.fixtureTeams}>
                              {fixture.homeTeam.name} {fixture.score ? `${fixture.score.home} - ${fixture.score.away}` : fixture.status}{' '}
                              {fixture.awayTeam.name}
                            </ThemedText>
                          </View>
                        ))
                      )}
                    </View>
                  ))}
            </View>

            <View style={[styles.sectionCard, { backgroundColor: card, borderColor: border }]}>
              <View style={styles.sectionHeader}>
                <ThemedText type="defaultSemiBold">{t('headToHeadTitle')}</ThemedText>
                <ThemedText style={{ color: mutedText }}>{t('headToHeadSubtitle')}</ThemedText>
              </View>
              {insights.headToHead.length === 0
                ? renderEmpty()
                : insights.headToHead.map((fixture) => (
                    <View key={fixture.id} style={styles.fixtureRow}>
                      <ThemedText style={{ color: mutedText }}>{formatShortDate(fixture.dateIso)}</ThemedText>
                      <ThemedText style={styles.fixtureTeams}>
                        {fixture.homeTeam.name}{' '}
                        {fixture.score ? `${fixture.score.home} - ${fixture.score.away}` : fixture.status}{' '}
                        {fixture.awayTeam.name}
                      </ThemedText>
                    </View>
                  ))}
            </View>

            <View style={[styles.sectionCard, { backgroundColor: card, borderColor: border }]}>
              <View style={styles.sectionHeader}>
                <ThemedText type="defaultSemiBold">{t('eventsTitle')}</ThemedText>
                <ThemedText style={{ color: mutedText }}>{t('eventsSubtitle')}</ThemedText>
              </View>
              {insights.events.length === 0
                ? renderEmpty()
                : insights.events.map((event, index) => (
                    <View key={`${event.player}-${index}`} style={styles.eventRow}>
                      <ThemedText style={styles.eventTime}>{event.time}</ThemedText>
                      <Image source={{ uri: event.team.logoUrl }} style={styles.eventLogo} contentFit="contain" />
                      <View style={styles.eventInfo}>
                        <ThemedText type="defaultSemiBold">
                          {event.player} · {event.detail}
                        </ThemedText>
                        <ThemedText style={{ color: mutedText }}>
                          {event.type}
                          {event.assist ? ` · ${t('assistLabel')}: ${event.assist}` : ''}
                        </ThemedText>
                      </View>
                    </View>
                  ))}
            </View>

            <View style={[styles.sectionCard, { backgroundColor: card, borderColor: border }]}>
              <View style={styles.sectionHeader}>
                <ThemedText type="defaultSemiBold">{t('lineupsTitle')}</ThemedText>
                <ThemedText style={{ color: mutedText }}>{t('lineupsSubtitle')}</ThemedText>
              </View>
              {insights.lineups.length === 0
                ? renderEmpty()
                : insights.lineups.map((lineup) => (
                    <View key={lineup.team.id} style={styles.subSection}>
                      <View style={styles.teamHeaderRow}>
                        <Image source={{ uri: lineup.team.logoUrl }} style={styles.teamBadge} contentFit="contain" />
                        <View>
                          <ThemedText type="defaultSemiBold">{lineup.team.name}</ThemedText>
                          <ThemedText style={{ color: mutedText }}>
                            {lineup.formation ?? t('formationFallback')}
                            {lineup.coach ? ` · ${t('coachLabel')}: ${lineup.coach}` : ''}
                          </ThemedText>
                        </View>
                      </View>
                      <View style={styles.lineupList}>
                        {lineup.starters.slice(0, 11).map((player) => (
                          <ThemedText key={player.name} style={[styles.lineupPlayer, { color: mutedText }]}>
                            {player.number ? `${player.number}. ` : ''}
                            {player.name} {player.position ? `(${player.position})` : ''}
                          </ThemedText>
                        ))}
                      </View>
                    </View>
                  ))}
            </View>

            <View style={[styles.sectionCard, { backgroundColor: card, borderColor: border }]}>
              <View style={styles.sectionHeader}>
                <ThemedText type="defaultSemiBold">{t('topScorersTitle')}</ThemedText>
                <ThemedText style={{ color: mutedText }}>{t('topScorersSubtitle')}</ThemedText>
              </View>
              {insights.topScorers.length === 0
                ? renderEmpty()
                : insights.topScorers.map((scorer, index) => (
                    <View key={`${scorer.player}-${index}`} style={styles.scorerRow}>
                      <Image source={{ uri: scorer.team.logoUrl }} style={styles.teamBadge} contentFit="contain" />
                      <View style={styles.scorerInfo}>
                        <ThemedText type="defaultSemiBold">{scorer.player}</ThemedText>
                        <ThemedText style={{ color: mutedText }}>{scorer.team.name}</ThemedText>
                      </View>
                      <ThemedText style={styles.scorerGoals}>
                        {t('goalsLabel', { count: scorer.goals })}
                      </ThemedText>
                    </View>
                  ))}
            </View>

            <View style={[styles.sectionCard, { backgroundColor: card, borderColor: border }]}>
              <View style={styles.sectionHeader}>
                <ThemedText type="defaultSemiBold">{t('playersCoachesTitle')}</ThemedText>
                <ThemedText style={{ color: mutedText }}>{t('playersCoachesSubtitle')}</ThemedText>
              </View>
              {insights.rosters.length === 0 && insights.coaches.length === 0 ? (
                renderEmpty()
              ) : (
                <>
                  {insights.coaches.map((coach) => (
                    <View key={coach.team.id} style={styles.coachRow}>
                      <Image source={{ uri: coach.team.logoUrl }} style={styles.teamBadge} contentFit="contain" />
                      <View>
                        <ThemedText type="defaultSemiBold">
                          {coach.name} · {coach.team.name}
                        </ThemedText>
                        <ThemedText style={{ color: mutedText }}>
                          {coach.nationality ? `${coach.nationality} · ` : ''}
                          {coach.age ? t('ageLabel', { count: coach.age }) : t('ageUnknown')}
                        </ThemedText>
                      </View>
                    </View>
                  ))}
                  {insights.rosters.map((roster) => (
                    <View key={roster.team.id} style={styles.subSection}>
                      <View style={styles.teamHeaderRow}>
                        <Image source={{ uri: roster.team.logoUrl }} style={styles.teamBadge} contentFit="contain" />
                        <ThemedText type="defaultSemiBold">{roster.team.name}</ThemedText>
                      </View>
                      {roster.players.length === 0 ? (
                        renderEmpty()
                      ) : (
                        roster.players.map((player) => (
                          <ThemedText key={player.name} style={[styles.rosterPlayer, { color: mutedText }]}>
                            {player.name}
                            {player.position ? ` · ${player.position}` : ''}
                            {player.age ? ` · ${t('ageLabel', { count: player.age })}` : ''}
                          </ThemedText>
                        ))
                      )}
                    </View>
                  ))}
                </>
              )}
            </View>

            <View style={[styles.sectionCard, { backgroundColor: card, borderColor: border }]}>
              <View style={styles.sectionHeader}>
                <ThemedText type="defaultSemiBold">{t('transfersTitle')}</ThemedText>
                <ThemedText style={{ color: mutedText }}>{t('transfersSubtitle')}</ThemedText>
              </View>
              {insights.transfers.length === 0
                ? renderEmpty()
                : insights.transfers.map((transfer, index) => (
                    <View key={`${transfer.player}-${index}`} style={styles.transferRow}>
                      <ThemedText type="defaultSemiBold">{transfer.player}</ThemedText>
                      <ThemedText style={{ color: mutedText }}>
                        {transfer.from ?? t('unknownTeam')} → {transfer.to ?? t('unknownTeam')}
                        {transfer.date ? ` · ${formatShortDate(transfer.date)}` : ''}
                      </ThemedText>
                    </View>
                  ))}
            </View>

            <View style={[styles.sectionCard, { backgroundColor: card, borderColor: border }]}>
              <View style={styles.sectionHeader}>
                <ThemedText type="defaultSemiBold">{t('trophiesTitle')}</ThemedText>
                <ThemedText style={{ color: mutedText }}>{t('trophiesSubtitle')}</ThemedText>
              </View>
              {insights.trophies.length === 0
                ? renderEmpty()
                : insights.trophies.map((trophy, index) => (
                    <View key={`${trophy.name}-${index}`} style={styles.trophyRow}>
                      <ThemedText type="defaultSemiBold">{trophy.name}</ThemedText>
                      <ThemedText style={{ color: mutedText }}>
                        {trophy.country ? `${trophy.country} · ` : ''}
                        {trophy.season ?? t('seasonUnknown')}
                        {trophy.place ? ` · ${trophy.place}` : ''}
                      </ThemedText>
                    </View>
                  ))}
            </View>

            <View style={[styles.sectionCard, { backgroundColor: card, borderColor: border }]}>
              <View style={styles.sectionHeader}>
                <ThemedText type="defaultSemiBold">{t('injuriesTitle')}</ThemedText>
                <ThemedText style={{ color: mutedText }}>{t('injuriesSubtitle')}</ThemedText>
              </View>
              {insights.injuries.length === 0
                ? renderEmpty()
                : insights.injuries.map((injury, index) => (
                    <View key={`${injury.player}-${index}`} style={styles.injuryRow}>
                      <Image source={{ uri: injury.team.logoUrl }} style={styles.teamBadge} contentFit="contain" />
                      <View>
                        <ThemedText type="defaultSemiBold">{injury.player}</ThemedText>
                        <ThemedText style={{ color: mutedText }}>
                          {injury.team.name} · {injury.type ?? t('injuryUnknown')}
                          {injury.reason ? ` · ${injury.reason}` : ''}
                        </ThemedText>
                      </View>
                    </View>
                  ))}
            </View>

            <View style={[styles.sectionCard, { backgroundColor: card, borderColor: border }]}>
              <View style={styles.sectionHeader}>
                <ThemedText type="defaultSemiBold">{t('oddsTitle')}</ThemedText>
                <ThemedText style={{ color: mutedText }}>{t('oddsSubtitle')}</ThemedText>
              </View>
              <View style={styles.subSection}>
                <ThemedText type="defaultSemiBold">{t('oddsPrematchTitle')}</ThemedText>
                {insights.odds.prematch.length === 0
                  ? renderEmpty()
                  : insights.odds.prematch.slice(0, 5).map((odd, index) => (
                      <View key={`${odd.bookmaker}-${index}`} style={styles.oddsRow}>
                        <ThemedText style={styles.oddsBookmaker}>{odd.bookmaker}</ThemedText>
                        <ThemedText style={styles.oddsValues}>
                          {odd.home ?? '-'} / {odd.draw ?? '-'} / {odd.away ?? '-'}
                        </ThemedText>
                      </View>
                    ))}
              </View>
              <View style={styles.subSection}>
                <ThemedText type="defaultSemiBold">{t('oddsLiveTitle')}</ThemedText>
                {insights.odds.live.length === 0
                  ? renderEmpty()
                  : insights.odds.live.slice(0, 5).map((odd, index) => (
                      <View key={`${odd.bookmaker}-${index}`} style={styles.oddsRow}>
                        <ThemedText style={styles.oddsBookmaker}>{odd.bookmaker}</ThemedText>
                        <ThemedText style={styles.oddsValues}>
                          {odd.home ?? '-'} / {odd.draw ?? '-'} / {odd.away ?? '-'}
                        </ThemedText>
                      </View>
                    ))}
              </View>
            </View>

            <View style={[styles.sectionCard, { backgroundColor: card, borderColor: border }]}>
              <View style={styles.sectionHeader}>
                <ThemedText type="defaultSemiBold">{t('statisticsTitle')}</ThemedText>
                <ThemedText style={{ color: mutedText }}>{t('statisticsSubtitle')}</ThemedText>
              </View>
              {insights.statistics.length === 0
                ? renderEmpty()
                : insights.statistics.map((teamStats) => (
                    <View key={teamStats.team.id} style={styles.subSection}>
                      <View style={styles.teamHeaderRow}>
                        <Image source={{ uri: teamStats.team.logoUrl }} style={styles.teamBadge} contentFit="contain" />
                        <ThemedText type="defaultSemiBold">{teamStats.team.name}</ThemedText>
                      </View>
                      {teamStats.values.length === 0 ? (
                        renderEmpty()
                      ) : (
                        teamStats.values.map((stat) => (
                          <View key={stat.label} style={styles.statRow}>
                            <ThemedText style={{ color: mutedText }}>{stat.label}</ThemedText>
                            <ThemedText type="defaultSemiBold">{stat.value}</ThemedText>
                          </View>
                        ))
                      )}
                    </View>
                  ))}
            </View>
          </>
        )}

        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <View style={styles.cardHeader}>
            <ThemedText type="defaultSemiBold">{t('predictions')}</ThemedText>
            <ThemedText style={{ color: mutedText }}>
              {isPremium ? t('predictionsPremium') : t('predictionsFree')}
            </ThemedText>
          </View>
          {visiblePredictions.length === 0
            ? renderEmpty()
            : visiblePredictions.map((prediction) => (
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
              ))}
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
  timePill: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
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
  sectionCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  subSection: {
    gap: 8,
    paddingTop: 4,
  },
  teamHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  teamBadge: {
    width: 28,
    height: 28,
  },
  standingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 10,
  },
  standingRank: {
    width: 28,
    textAlign: 'center',
  },
  standingLogo: {
    width: 30,
    height: 30,
  },
  standingTeamInfo: {
    flex: 1,
    gap: 2,
  },
  standingGoalDiff: {
    fontWeight: '600',
  },
  fixtureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fixtureTeams: {
    flex: 1,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  eventTime: {
    width: 42,
  },
  eventLogo: {
    width: 26,
    height: 26,
  },
  eventInfo: {
    flex: 1,
    gap: 2,
  },
  lineupList: {
    gap: 4,
    paddingLeft: 6,
  },
  lineupPlayer: {
  },
  scorerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scorerInfo: {
    flex: 1,
  },
  scorerGoals: {
    fontWeight: '600',
  },
  coachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rosterPlayer: {
  },
  transferRow: {
    gap: 4,
  },
  trophyRow: {
    gap: 4,
  },
  injuryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  oddsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  oddsBookmaker: {
    flex: 1,
  },
  oddsValues: {
    fontWeight: '600',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    gap: 8,
  },
  rateCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 8,
  },
  rateLogo: {
    width: 28,
    height: 28,
  },
  rateLabel: {
    color: '#FFFFFF',
    textTransform: 'uppercase',
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
