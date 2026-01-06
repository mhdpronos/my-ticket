// Le code qui affiche une carte de match dans la liste.
import { memo } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
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
    return 'Terminé';
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
  const success = useThemeColor({}, 'success');
  const danger = useThemeColor({}, 'danger');

  const winRate = match.winRate;
  const homeRateColor = winRate && winRate.home >= 60 ? success : danger;
  const awayRateColor = winRate && winRate.away >= 60 ? success : danger;

  return (
    <Pressable style={[styles.card, { backgroundColor: card, borderColor: border }]} onPress={onPress}>
      <View style={styles.headerRow}>
        <View style={styles.statusWrap}>
          <View style={[styles.statusDot, { backgroundColor: match.status === 'live' ? accent : tint }]} />
          <ThemedText type="defaultSemiBold" style={{ color: match.status === 'live' ? accent : tint }}>
            {formatStatus(match)}
          </ThemedText>
        </View>
        <View style={[styles.leagueChip, { borderColor: border }]}>
          <ThemedText style={{ color: mutedText }}>{match.league.name}</ThemedText>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => onToggleLeagueFavorite(match.league.id)}>
            <MaterialCommunityIcons
              name={isLeagueFavorite(match.league.id) ? 'star' : 'star-outline'}
              size={16}
              color={accent}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.teamsRow}>
        <View style={styles.teamBlock}>
          <View style={styles.teamMeta}>
            <Image source={{ uri: match.homeTeam.logoUrl }} style={styles.logo} contentFit="contain" />
            <View>
              <ThemedText type="defaultSemiBold">{match.homeTeam.name}</ThemedText>
              {winRate && (
                <ThemedText style={{ color: homeRateColor }}>{winRate.home}% victoire</ThemedText>
              )}
            </View>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => onToggleTeamFavorite(match.homeTeam.id)}
            style={styles.starButton}>
            <MaterialCommunityIcons
              name={isTeamFavorite(match.homeTeam.id) ? 'star' : 'star-outline'}
              size={18}
              color={accent}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.scoreBlock}>
          <ThemedText type="title" style={{ color: tint }}>
            {formatScore(match)}
          </ThemedText>
          <ThemedText style={{ color: mutedText }}>
            {new Date(match.kickoffIso).toLocaleDateString('fr-FR', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
            })}{' '}
            •{' '}
            {new Date(match.kickoffIso).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </ThemedText>
        </View>

        <View style={styles.teamBlock}>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => onToggleTeamFavorite(match.awayTeam.id)}
            style={styles.starButton}>
            <MaterialCommunityIcons
              name={isTeamFavorite(match.awayTeam.id) ? 'star' : 'star-outline'}
              size={18}
              color={accent}
            />
          </TouchableOpacity>
          <View style={styles.teamMetaRight}>
            <View>
              <ThemedText type="defaultSemiBold" style={styles.alignRight}>
                {match.awayTeam.name}
              </ThemedText>
              {winRate && (
                <ThemedText style={[styles.alignRight, { color: awayRateColor }]}>
                  {winRate.away}% victoire
                </ThemedText>
              )}
            </View>
            <Image source={{ uri: match.awayTeam.logoUrl }} style={styles.logo} contentFit="contain" />
          </View>
        </View>
      </View>

      <View style={styles.footerRow}>
        <ThemedText style={{ color: mutedText }}>{match.league.country}</ThemedText>
        <ThemedText style={{ color: mutedText }}>{match.venue ?? 'Stade principal'}</ThemedText>
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
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  leagueChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  teamBlock: {
    flex: 1,
    gap: 6,
  },
  teamMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  teamMetaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  logo: {
    width: 36,
    height: 36,
  },
  scoreBlock: {
    alignItems: 'center',
    gap: 4,
  },
  alignRight: {
    textAlign: 'right',
  },
  starButton: {
    alignSelf: 'flex-end',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
