import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

// Favorites screen placeholder for teams and leagues.

export default function FavoritesScreen() {
  const background = useThemeColor({}, 'background');
  const mutedText = useThemeColor({}, 'mutedText');

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.header}>
        <ThemedText type="title">Favoris</ThemedText>
        <ThemedText style={{ color: mutedText }}>Tes équipes et ligues suivies.</ThemedText>
      </View>
      <View style={styles.emptyState}>
        <MaterialCommunityIcons name="star-circle-outline" size={48} color={mutedText} />
        <ThemedText type="defaultSemiBold">Aucun favori pour le moment</ThemedText>
        <ThemedText style={{ color: mutedText }}>Ajoute des équipes depuis la page Matchs.</ThemedText>
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
