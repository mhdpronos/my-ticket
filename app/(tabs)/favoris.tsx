import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { TexteTheme } from '@/composants/texte-theme';
import { useCouleurTheme } from '@/crochets/utiliser-couleur-theme';

// Écran Favoris (espace réservé) pour les équipes et ligues.

export default function EcranFavoris() {
  const background = useCouleurTheme({}, 'background');
  const mutedText = useCouleurTheme({}, 'mutedText');

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.header}>
        <TexteTheme type="title">Favoris</TexteTheme>
        <TexteTheme style={{ color: mutedText }}>Tes équipes et ligues suivies.</TexteTheme>
      </View>
      <View style={styles.emptyState}>
        <MaterialCommunityIcons name="star-circle-outline" size={48} color={mutedText} />
        <TexteTheme type="defaultSemiBold">Aucun favori pour le moment</TexteTheme>
        <TexteTheme style={{ color: mutedText }}>Ajoute des équipes depuis la page Matchs.</TexteTheme>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 24,
    gap: 6,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
});
