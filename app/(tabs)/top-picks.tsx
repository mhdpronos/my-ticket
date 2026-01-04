import { ScrollView, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

// Curated daily picks screen.

const topPicks = [
  {
    id: 'pick-1',
    title: 'Top Pick #1',
    description: 'Sélection premium avec la meilleure value bet du jour.',
    confidence: 'Très élevé',
  },
  {
    id: 'pick-2',
    title: 'Top Pick #2',
    description: 'Match stable avec un historique positif.',
    confidence: 'Élevé',
  },
];

export default function TopPicksScreen() {
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');

  return (
    <ScrollView style={[styles.container, { backgroundColor: background }]} contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <ThemedText type="title">Top Picks</ThemedText>
        <ThemedText style={{ color: mutedText }}>Sélection du jour par MHD Pronos.</ThemedText>
      </View>

      {topPicks.map((pick) => (
        <View key={pick.id} style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="crown-outline" size={20} color={mutedText} />
            <ThemedText type="defaultSemiBold">{pick.title}</ThemedText>
          </View>
          <ThemedText style={{ color: mutedText }}>{pick.description}</ThemedText>
          <ThemedText type="defaultSemiBold">Confiance: {pick.confidence}</ThemedText>
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
