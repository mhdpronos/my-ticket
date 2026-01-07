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
  predictionCount: number;
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

function MatchCardComponent({
  match,
  predictionCount,
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

  const kickoffTime = new Date(match.kickoffIso).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Pressable
      style={[
        styles.card,
        {
          backgroundColor: card,
          borderColor: match.status === 'live' ? tint : border,
        },
      ]}
      onPress={onPress}>
      <View style={styles.headerRow}>
        <ThemedText type="defaultSemiBold" style={{ color: mutedText }}>
          {match.league.name}
        </ThemedText>
        <View style={[styles.statusWrap, { backgroundColor: match.status === 'live' ? tint : border }]}>
          <ThemedText type="defaultSemiBold" style={{ color: match.status === 'live' ? '#FFFFFF' : mutedText }}>
            {formatStatus(match)}
          </ThemedText>
        </View>
      </View>

      <View style={styles.teamsRow}>
        <View style={styles.teamBlock}>
          <Image source={{ uri: match.homeTeam.logoUrl }} style={styles.logo} contentFit="contain" />
          <View>
            <View style={styles.teamNameRow}>
              <ThemedText type="defaultSemiBold">{match.homeTeam.name}</ThemedText>
              <TouchableOpacity accessibilityRole="button" onPress={() => onToggleTeamFavorite(match.homeTeam.id)}>
                <MaterialCommunityIcons
                  name={isTeamFavorite(match.homeTeam.id) ? 'star' : 'star-outline'}
                  size={16}
                  color={accent}
                />
              </TouchableOpacity>
            </View>
            <ThemedText style={{ color: mutedText }}>{match.league.country}</ThemedText>
          </View>
        </View>

        <View style={[styles.timePill, { backgroundColor: border }]}>
          <ThemedText type="defaultSemiBold" style={{ color: tint }}>
            {kickoffTime}
          </ThemedText>
        </View>

        <View style={[styles.teamBlock, styles.teamBlockRight]}>
          <View style={styles.teamRightText}>
            <View style={styles.teamNameRowRight}>
              <TouchableOpacity accessibilityRole="button" onPress={() => onToggleTeamFavorite(match.awayTeam.id)}>
                <MaterialCommunityIcons
                  name={isTeamFavorite(match.awayTeam.id) ? 'star' : 'star-outline'}
                  size={16}
                  color={accent}
                />
              </TouchableOpacity>
              <ThemedText type="defaultSemiBold" style={styles.alignRight}>
                {match.awayTeam.name}
              </ThemedText>
            </View>
            <ThemedText style={[styles.alignRight, { color: mutedText }]}>{match.venue ?? 'Stade principal'}</ThemedText>
          </View>
          <Image source={{ uri: match.awayTeam.logoUrl }} style={styles.logo} contentFit="contain" />
        </View>
      </View>

      <View style={styles.footerRow}>
        <ThemedText style={{ color: mutedText }}>{predictionCount} pronos dispo</ThemedText>
        <View style={styles.footerActions}>
          <TouchableOpacity accessibilityRole="button" onPress={() => onToggleLeagueFavorite(match.league.id)}>
            <MaterialCommunityIcons
              name={isLeagueFavorite(match.league.id) ? 'star' : 'star-outline'}
              size={18}
              color={accent}
            />
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" onPress={onPress} style={[styles.addButton, { backgroundColor: tint }]}>
            <MaterialCommunityIcons name="plus" size={16} color="#FFFFFF" />
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
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusWrap: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  teamBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  teamBlockRight: {
    justifyContent: 'flex-end',
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
  teamRightText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 8,
  },
  logo: {
    width: 36,
    height: 36,
  },
  timePill: {
    minWidth: 64,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  alignRight: {
    textAlign: 'right',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
