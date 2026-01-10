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
  const centerLabel = isLive || isFinished ? formatScore(match) : kickoffLabel;
  const statusLabel = isLive ? 'LIVE' : isFinished ? 'FT' : 'À venir';

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
          <View style={[styles.statusPill, { backgroundColor: isLive ? accent : backgroundSecondary, borderColor: border }]}>
            <View style={[styles.statusDot, { backgroundColor: isLive ? '#FFFFFF' : tint }]} />
            <ThemedText style={{ color: isLive ? '#FFFFFF' : tint }} numberOfLines={1}>
              {statusLabel}
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.teamsRow}>
        <View style={styles.teamBlock}>
          <Image source={{ uri: match.homeTeam.logoUrl }} style={styles.logo} contentFit="contain" />
          <View style={styles.teamText}>
            <ThemedText type="defaultSemiBold" numberOfLines={1}>
              {match.homeTeam.name}
            </ThemedText>
          </View>
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

        <View style={styles.scoreBlock}>
          <View style={[styles.scorePill, { backgroundColor: backgroundSecondary, borderColor: border }]}>
            <ThemedText type="defaultSemiBold" style={{ color: tint }}>
              {centerLabel}
            </ThemedText>
            <ThemedText style={{ color: mutedText }} numberOfLines={1}>
              {isLive ? `LIVE ${match.liveMinute ?? 0}'` : isFinished ? 'Terminé' : 'Coup d’envoi'}
            </ThemedText>
          </View>
        </View>

        <View style={styles.teamBlockRight}>
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
          <View style={styles.teamTextRight}>
            <ThemedText type="defaultSemiBold" style={styles.alignRight} numberOfLines={1}>
              {match.awayTeam.name}
            </ThemedText>
          </View>
          <Image source={{ uri: match.awayTeam.logoUrl }} style={styles.logo} contentFit="contain" />
        </View>
      </View>

      {winRate && (
        <View style={styles.formRow}>
          <ThemedText style={{ color: mutedText }} numberOfLines={1}>
            Forme: <ThemedText style={{ color: homeRateColor }}>{winRate.home}%</ThemedText> •{' '}
            <ThemedText style={{ color: mutedText }}>{winRate.draw}%</ThemedText> •{' '}
            <ThemedText style={{ color: awayRateColor }}>{winRate.away}%</ThemedText>
          </ThemedText>
        </View>
      )}

      <View style={styles.footerRow}>
        <View style={styles.footerInfo}>
          <MaterialCommunityIcons name="map-marker-outline" size={16} color={mutedText} />
          <ThemedText style={{ color: mutedText }} numberOfLines={1}>
            {match.venue ?? '—'}
          </ThemedText>
        </View>
        <View style={styles.footerInfoRight}>
          <ThemedText style={{ color: mutedText }} numberOfLines={1}>
            {availablePredictions} pronos dispo
          </ThemedText>
          <TouchableOpacity accessibilityRole="button" style={[styles.plusButton, { borderColor: border }]}>
            <MaterialCommunityIcons name="plus" size={14} color={accent} />
            <ThemedText style={{ color: accent }}>Ticket</ThemedText>
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
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  leagueBlock: {
    flex: 1,
    gap: 2,
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
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    paddingVertical: 6,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  teamBlockRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
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
    minWidth: 100,
    gap: 4,
  },
  alignRight: {
    textAlign: 'right',
  },
  teamText: {
    flex: 1,
  },
  teamTextRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  starButton: {
    padding: 4,
  },
  formRow: {
    paddingHorizontal: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  footerInfoRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  plusButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
