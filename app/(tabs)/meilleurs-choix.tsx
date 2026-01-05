import { ScrollView, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { TexteTheme } from '@/composants/texte-theme';
import { useCouleurTheme } from '@/crochets/utiliser-couleur-theme';

// Écran des choix du jour sélectionnés.

const meilleursChoix = [
  {
    id: 'pick-1',
    title: 'Choix du jour #1',
    description: 'Sélection premium avec la meilleure value bet du jour.',
    confidence: 'Très élevé',
  },
  {
    id: 'pick-2',
    title: 'Choix du jour #2',
    description: 'Match stable avec un historique positif.',
    confidence: 'Élevé',
  },
];

export default function EcranMeilleursChoix() {
  const background = useCouleurTheme({}, 'background');
  const card = useCouleurTheme({}, 'card');
  const border = useCouleurTheme({}, 'border');
  const mutedText = useCouleurTheme({}, 'mutedText');

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: background }]}
      contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TexteTheme type="title">Meilleurs choix</TexteTheme>
        <TexteTheme style={{ color: mutedText }}>Sélection du jour par MHD Pronos.</TexteTheme>
      </View>

      {meilleursChoix.map((pick) => (
        <View key={pick.id} style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="crown-outline" size={20} color={mutedText} />
            <TexteTheme type="defaultSemiBold">{pick.title}</TexteTheme>
          </View>
          <TexteTheme style={{ color: mutedText }}>{pick.description}</TexteTheme>
          <TexteTheme type="defaultSemiBold">Confiance: {pick.confidence}</TexteTheme>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 14,
  },
  header: {
    gap: 6,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
