import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function SubscriptionScreen() {
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.header}>
        <ThemedText type="title">MY TICKET +</ThemedText>
        <ThemedText style={{ color: mutedText }}>
          Débloque 3 pronostics premium par match et les meilleures cotes.
        </ThemedText>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <ThemedText type="defaultSemiBold">Plan Mensuel</ThemedText>
        <ThemedText style={{ color: mutedText }}>Accès complet • 30 jours</ThemedText>
        <ThemedText type="subtitle">9 900 FCFA</ThemedText>
        <Pressable style={[styles.primaryButton, { backgroundColor: tint }]}>
          <ThemedText style={styles.primaryButtonText}>Choisir ce plan</ThemedText>
        </Pressable>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <ThemedText type="defaultSemiBold">Plan Annuel</ThemedText>
        <ThemedText style={{ color: mutedText }}>2 mois offerts • 12 mois</ThemedText>
        <ThemedText type="subtitle">99 000 FCFA</ThemedText>
        <Pressable style={[styles.primaryButton, { backgroundColor: tint }]}>
          <ThemedText style={styles.primaryButtonText}>Choisir ce plan</ThemedText>
        </Pressable>
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
  header: {
    gap: 8,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  primaryButton: {
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
