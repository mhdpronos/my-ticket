import { memo } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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
  const highlight = useThemeColor({}, 'tint');
  const accent = useThemeColor({}, 'accent');

  return (
    <Pressable style={[styles.card, { backgroundColor: card, borderColor: border }]} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.teams}>
          <View style={styles.teamRow}>
            <ThemedText type="defaultSemiBold">{match.homeTeam.name}</ThemedText>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => onToggleTeamFavorite(match.homeTeam.id)}>
              <MaterialCommunityIcons
                name={isTeamFavorite(match.homeTeam.id) ? 'star' : 'star-outline'}
                size={18}
                color={accent}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.teamRow}>
            <ThemedText type="defaultSemiBold">{match.awayTeam.name}</ThemedText>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => onToggleTeamFavorite(match.awayTeam.id)}>
              <MaterialCommunityIcons
                name={isTeamFavorite(match.awayTeam.id) ? 'star' : 'star-outline'}
                size={18}
                color={accent}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.meta}>
          <ThemedText type="defaultSemiBold" style={{ color: highlight }}>
            {new Date(match.kickoffIso).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </ThemedText>
          <ThemedText style={{ color: mutedText }}>{match.status === 'finished' ? 'Terminé' : 'À venir'}</ThemedText>
        </View>
      </View>
      <View style={styles.infoRow}>
        <ThemedText style={{ color: mutedText }}>{match.league.name}</ThemedText>
        <View style={styles.leagueRow}>
          <ThemedText style={{ color: mutedText }}>{match.league.country}</ThemedText>
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
    </Pressable>
  );
}

export const MatchCard = memo(MatchCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  teams: {
    gap: 6,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  meta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leagueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
