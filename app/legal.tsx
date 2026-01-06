import { StyleSheet, View } from 'react-native';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function LegalScreen() {
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ScreenHeader title="Mentions légales" subtitle="Informations essentielles pour rester en règle." />
      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <ThemedText type="defaultSemiBold">Mentions légales</ThemedText>
        <ThemedText style={{ color: mutedText }}>
          MY TICKET propose des informations et comparaisons de cotes. Pas un bookmaker.
        </ThemedText>
      </View>
      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <ThemedText type="defaultSemiBold">Responsabilité</ThemedText>
        <ThemedText style={{ color: mutedText }}>
          Pariez de manière responsable. Les pronostics sont à titre indicatif et ne garantissent aucun gain.
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
});
