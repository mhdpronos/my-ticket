// Le code qui affiche une carte de match dans la liste.
import { memo, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { Match } from '@/types';
import { getLocale } from '@/utils/i18n';

type MatchCardProps = {
  match: Match;
  onPress: () => void;
  onToggleFavoriteMatch: (match: Match) => void;
  isMatchFavorite: (matchId: string) => boolean;
};

const formatScore = (match: Match, fallback: string) => {
  if (!match.score) {
    return fallback;
  }
  return `${match.score.home} : ${match.score.away}`;
};

function MatchCardComponent({
  match,
  onPress,
  onToggleFavoriteMatch,
  isMatchFavorite,
}: MatchCardProps) {
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');
  const accent = useThemeColor({}, 'accent');
  const backgroundSecondary = useThemeColor({}, 'backgroundSecondary');
  const { t, language } = useTranslation();
  const locale = getLocale(language);

  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';
  const kickoffLabel = new Date(match.kickoffIso).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
  const statusTextColor = isLive ? '#F97316' : isFinished ? '#FACC15' : '#22C55E';
  const [liveSeconds, setLiveSeconds] = useState(() => (match.liveMinute ?? 0) * 60);

  useEffect(() => {
    if (!isLive) {
      return;
    }
    setLiveSeconds((match.liveMinute ?? 0) * 60);
    const interval = setInterval(() => {
      setLiveSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive, match.liveMinute]);

  const liveTimerLabel = useMemo(() => {
    const minutes = Math.floor(liveSeconds / 60);
    const seconds = liveSeconds % 60;
    return `${String(minutes).padStart(2, '0')}, ${String(seconds).padStart(2, '0')}`;
  }, [liveSeconds]);

  const statusLabel = isLive
    ? `${t('matchLive')} ${liveTimerLabel}`
    : isFinished
    ? t('matchFinished')
    : t('matchUpcoming');

  return (
    <Pressable style={[styles.card, { backgroundColor: card, borderColor: border }]} onPress={onPress}>
      <View style={styles.headerRow}>
        <View style={styles.leagueBlock}>
          <ThemedText type="defaultSemiBold" numberOfLines={1}>
            {match.league.name}
          </ThemedText>
          <ThemedText style={{ color: mutedText }} numberOfLines={1}>
            {match.league.country}
          </ThemedText>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => onToggleFavoriteMatch(match)}
            style={[styles.iconPill, { borderColor: border, backgroundColor: backgroundSecondary }]}>
            <MaterialCommunityIcons
              name={isMatchFavorite(match.id) ? 'star' : 'star-outline'}
              size={16}
              color={accent}
            />
          </TouchableOpacity>
          <View style={styles.statusPill}>
            <ThemedText style={{ color: statusTextColor }}>{statusLabel}</ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.teamsRow}>
        <View style={styles.teamColumn}>
          <View style={styles.teamRow}>
            <Image source={{ uri: match.homeTeam.logoUrl }} style={styles.logo} contentFit="contain" />
            <View style={styles.teamInfo}>
              <View style={styles.teamNameRow}>
                <ThemedText type="defaultSemiBold" numberOfLines={1} ellipsizeMode="tail" style={styles.teamName}>
                  {match.homeTeam.name}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.scoreBlock}>
          <View style={[styles.scorePill, { backgroundColor: backgroundSecondary, borderColor: border }]}>
            <ThemedText type="defaultSemiBold" style={{ color: tint }}>
              {match.status === 'upcoming' ? kickoffLabel : formatScore(match, t('matchScoreFallback'))}
            </ThemedText>
            {match.status === 'upcoming' ? null : (
              <ThemedText style={{ color: mutedText }}>{isLive ? t('matchLive') : t('matchFinished')}</ThemedText>
            )}
          </View>
        </View>

        <View style={styles.teamColumn}>
          <View style={styles.teamRowRight}>
            <View style={styles.teamInfoRight}>
              <View style={styles.teamNameRowRight}>
                <ThemedText
                  type="defaultSemiBold"
                  style={[styles.alignRight, styles.teamName]}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {match.awayTeam.name}
                </ThemedText>
              </View>
            </View>
            <Image source={{ uri: match.awayTeam.logoUrl }} style={styles.logo} contentFit="contain" />
          </View>
        </View>
      </View>

      <View style={styles.footerRow}>
        <View style={styles.footerInfo}>
          <MaterialCommunityIcons name="map-marker-outline" size={16} color={mutedText} />
          <ThemedText style={{ color: mutedText }} numberOfLines={1}>
            {match.venue ?? t('matchVenueFallback')}
          </ThemedText>
        </View>
        <View style={styles.footerInfoRight}>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={onPress}
            style={[styles.pronoButton, { backgroundColor: tint }]}>
            <ThemedText style={styles.pronoButtonText}>{t('buttonViewPredictions')}</ThemedText>
            <MaterialCommunityIcons name="chevron-right" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}

export const MatchCard = memo(MatchCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    gap: 14,
    marginHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  leagueBlock: {
    flex: 1,
    gap: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconPill: {
    borderWidth: 1,
    padding: 6,
    borderRadius: 999,
  },
  statusPill: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  teamColumn: {
    flex: 1,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  teamRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  teamInfo: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  teamInfoRight: {
    flex: 1,
    gap: 4,
    alignItems: 'flex-end',
    minWidth: 0,
  },
  teamNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  teamNameRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'flex-end',
  },
  teamName: {
    flexShrink: 1,
  },
  logo: {
    width: 34,
    height: 34,
  },
  scoreBlock: {
    alignItems: 'center',
    gap: 4,
  },
  scorePill: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    minWidth: 90,
    gap: 4,
  },
  alignRight: {
    textAlign: 'right',
  },
  starButton: {
    padding: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  footerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerInfoRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pronoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  pronoButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
