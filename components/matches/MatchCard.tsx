// Le code qui affiche une carte de match dans la liste.
import { memo } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAppStore } from '@/store/useAppStore';
import { Match } from '@/types';

type MatchCardProps = {
  match: Match;
  onPress: () => void;
  onToggleTeamFavorite: (teamId: string) => void;
  onToggleLeagueFavorite: (leagueId: string) => void;
  isTeamFavorite: (teamId: string) => boolean;
  isLeagueFavorite: (leagueId: string) => boolean;
};

const formatStatus = (match: Match) => {
  if (match.status === 'live') {
    return `LIVE ${match.liveMinute ?? 0}'`;
  }
  if (match.status === 'finished') {
    return 'FT';
  }
  return 'À venir';
};

const formatScore = (match: Match) => {
  if (!match.score) {
    return '-- : --';
  }
  return `${match.score.home} : ${match.score.away}`;
};

function MatchCardComponent({
  match,
  onPress,
  onToggleTeamFavorite,
  onToggleLeagueFavorite,
  isTeamFavorite,
  isLeagueFavorite,
}: MatchCardProps) {
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');
  const accent = useThemeColor({}, 'accent');
  const backgroundSecondary = useThemeColor({}, 'backgroundSecondary');
  const success = useThemeColor({}, 'success');
  const warning = useThemeColor({}, 'warning');
  const danger = useThemeColor({}, 'danger');

  const userAccess = useAppStore((state) => state.userAccess);

  const winRate = match.winRate;
  const homeRateColor = winRate && winRate.home >= 60 ? success : danger;
  const awayRateColor = winRate && winRate.away >= 60 ? success : danger;
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';
  const availablePredictions = userAccess.status === 'PREMIUM' ? 6 : 3;
  const kickoffLabel = new Date(match.kickoffIso).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const statusColor = isLive ? danger : isFinished ? warning : tint;

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
            onPress={() => onToggleLeagueFavorite(match.league.id)}
            style={[styles.iconPill, { borderColor: border, backgroundColor: backgroundSecondary }]}>
            <MaterialCommunityIcons
              name={isLeagueFavorite(match.league.id) ? 'star' : 'star-outline'}
              size={16}
              color={accent}
            />
          </TouchableOpacity>
          <View style={[styles.statusPill, { backgroundColor: statusColor, borderColor: border }]}>
            <View style={[styles.statusDot, { backgroundColor: '#FFFFFF' }]} />
            <ThemedText style={{ color: '#FFFFFF' }}>{formatStatus(match)}</ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.teamsRow}>
        <View style={styles.teamColumn}>
          <View style={styles.teamRow}>
            <Image source={{ uri: match.homeTeam.logoUrl }} style={styles.logo} contentFit="contain" />
            <View style={styles.teamInfo}>
              <View style={styles.teamNameRow}>
                <ThemedText type="defaultSemiBold" numberOfLines={1}>
                  {match.homeTeam.name}
                </ThemedText>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => onToggleTeamFavorite(match.homeTeam.id)}
                  style={styles.starButton}>
                  <MaterialCommunityIcons
                    name={isTeamFavorite(match.homeTeam.id) ? 'star' : 'star-outline'}
                    size={16}
                    color={accent}
                  />
                </TouchableOpacity>
              </View>
              {winRate && (
                <ThemedText style={{ color: homeRateColor }} numberOfLines={1}>
                  {winRate.home}% victoire
                </ThemedText>
              )}
            </View>
          </View>
        </View>

        <View style={styles.scoreBlock}>
          <View style={[styles.scorePill, { backgroundColor: backgroundSecondary, borderColor: border }]}>
            <ThemedText type="defaultSemiBold" style={{ color: tint }}>
              {match.status === 'upcoming' ? kickoffLabel : formatScore(match)}
            </ThemedText>
            <ThemedText style={{ color: mutedText }}>
              {match.status === 'upcoming' ? 'Heure' : isLive ? 'En direct' : 'Terminé'}
            </ThemedText>
          </View>
        </View>

        <View style={styles.teamColumn}>
          <View style={styles.teamRowRight}>
            <View style={styles.teamInfoRight}>
              <View style={styles.teamNameRowRight}>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => onToggleTeamFavorite(match.awayTeam.id)}
                  style={styles.starButton}>
                  <MaterialCommunityIcons
                    name={isTeamFavorite(match.awayTeam.id) ? 'star' : 'star-outline'}
                    size={16}
                    color={accent}
                  />
                </TouchableOpacity>
                <ThemedText type="defaultSemiBold" style={styles.alignRight} numberOfLines={1}>
                  {match.awayTeam.name}
                </ThemedText>
              </View>
              {winRate && (
                <ThemedText style={[styles.alignRight, { color: awayRateColor }]} numberOfLines={1}>
                  {winRate.away}% victoire
                </ThemedText>
              )}
            </View>
            <Image source={{ uri: match.awayTeam.logoUrl }} style={styles.logo} contentFit="contain" />
          </View>
        </View>
      </View>

      <View style={styles.footerRow}>
        <View style={styles.footerInfo}>
          <MaterialCommunityIcons name="map-marker-outline" size={16} color={mutedText} />
          <ThemedText style={{ color: mutedText }} numberOfLines={1}>
            {match.venue ?? '—'}
          </ThemedText>
        </View>
        <View style={styles.footerInfoRight}>
          <ThemedText style={{ color: mutedText }}>{availablePredictions} pronos dispo</ThemedText>
          <TouchableOpacity accessibilityRole="button" style={[styles.addButton, { borderColor: border }]}
            disabled>
            <MaterialCommunityIcons name="plus" size={14} color={accent} />
          </TouchableOpacity>
        </View>
      </View>

      {winRate ? (
        <View style={styles.formRow}>
          <ThemedText style={{ color: mutedText }} numberOfLines={1}>
            Forme: {winRate.home}% • {winRate.draw}% nul • {winRate.away}%
          </ThemedText>
        </View>
      ) : null}
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
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
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
  },
  teamInfoRight: {
    flex: 1,
    gap: 4,
    alignItems: 'flex-end',
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
  addButton: {
    borderWidth: 1,
    borderRadius: 999,
    padding: 4,
  },
  formRow: {
    paddingTop: 4,
  },
});
