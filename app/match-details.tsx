// Le code de la page qui affiche les détails avancés d'un match.
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function MatchDetailsScreen() {
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const success = useThemeColor({}, 'success');
  const danger = useThemeColor({}, 'danger');

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={[styles.hero, { backgroundColor: card, borderColor: border }]}> 
        <ThemedText type="title">Détails du match</ThemedText>
        <ThemedText style={{ color: mutedText }}>
          Statistiques, compositions, historique et tendances de performance.
        </ThemedText>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}> 
        <ThemedText type="defaultSemiBold">Taux de réussite estimé</ThemedText>
        <View style={styles.rateRow}>
          <ThemedText style={{ color: success }}>Équipe A 68%</ThemedText>
          <ThemedText style={{ color: mutedText }}>Nul 18%</ThemedText>
          <ThemedText style={{ color: danger }}>Équipe B 14%</ThemedText>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}> 
        <ThemedText type="defaultSemiBold">Scores récents</ThemedText>
        <View style={styles.listRow}>
          <ThemedText style={{ color: mutedText }}>04/09 • Équipe A 2-1 Équipe B</ThemedText>
          <ThemedText style={{ color: mutedText }}>29/08 • Équipe B 1-1 Équipe A</ThemedText>
          <ThemedText style={{ color: mutedText }}>21/08 • Équipe A 3-0 Équipe B</ThemedText>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}> 
        <ThemedText type="defaultSemiBold">Informations stade & météo</ThemedText>
        <ThemedText style={{ color: mutedText }}>Coup d’envoi 20:45 • Stade national</ThemedText>
        <ThemedText style={{ color: mutedText }}>22°C • Terrain sec • Vent 12 km/h</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 16,
  },
  hero: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    gap: 8,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  listRow: {
    gap: 6,
  },
});
