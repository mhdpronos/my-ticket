import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { TexteTheme } from '@/composants/texte-theme';
import { useCouleurTheme } from '@/crochets/utiliser-couleur-theme';
import { Match } from '@/types/domaine';

// Carte compacte utilisée dans la liste des matchs.

type CarteRencontreProps = {
  match: Match;
  onPress: () => void;
};

export function CarteRencontre({ match, onPress }: CarteRencontreProps) {
  const card = useCouleurTheme({}, 'card');
  const border = useCouleurTheme({}, 'border');
  const mutedText = useCouleurTheme({}, 'mutedText');
  const highlight = useCouleurTheme({}, 'tint');

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: card, borderColor: border }]} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.teams}>
          <TexteTheme type="defaultSemiBold">{match.homeTeam}</TexteTheme>
          <TexteTheme type="defaultSemiBold">{match.awayTeam}</TexteTheme>
        </View>
        <View style={styles.meta}>
          <TexteTheme type="defaultSemiBold" style={{ color: highlight }}>
            {new Date(match.kickoffIso).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </TexteTheme>
          <TexteTheme style={{ color: mutedText }}>{match.status === 'finished' ? 'Terminé' : 'À venir'}</TexteTheme>
        </View>
      </View>
      <View style={styles.infoRow}>
        <TexteTheme style={{ color: mutedText }}>{match.league}</TexteTheme>
        <TexteTheme style={{ color: mutedText }}>{match.country}</TexteTheme>
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
