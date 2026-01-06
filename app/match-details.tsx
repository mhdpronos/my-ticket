import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function MatchDetailsScreen() {
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <ThemedText type="defaultSemiBold">Détails du match</ThemedText>
        <ThemedText style={{ color: mutedText }}>
          Cet écran servira pour les statistiques avancées et les compositions d’équipe.
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
});
