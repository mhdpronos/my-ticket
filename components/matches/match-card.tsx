import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Match } from '@/types/domain';

// Compact match card used in the match list.

type MatchCardProps = {
  match: Match;
  onPress: () => void;
};

export function MatchCard({ match, onPress }: MatchCardProps) {
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const highlight = useThemeColor({}, 'tint');

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: card, borderColor: border }]} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.teams}>
          <ThemedText type="defaultSemiBold">{match.homeTeam}</ThemedText>
          <ThemedText type="defaultSemiBold">{match.awayTeam}</ThemedText>
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
        <ThemedText style={{ color: mutedText }}>{match.league}</ThemedText>
        <ThemedText style={{ color: mutedText }}>{match.country}</ThemedText>
      </View>
    </TouchableOpacity>
  );
}

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
  meta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
