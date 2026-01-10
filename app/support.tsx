import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function SupportScreen() {
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ScreenHeader title="Aide & Support" subtitle="Besoin d'un coup de main ? On est là." />
      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <MaterialCommunityIcons name="headset" size={22} color={mutedText} />
        <View style={styles.textBlock}>
          <ThemedText type="defaultSemiBold">Support MY TICKET</ThemedText>
          <ThemedText style={{ color: mutedText }}>
            Contacte-nous sur WhatsApp ou par email pour une réponse rapide.
          </ThemedText>
        </View>
      </View>
      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <ThemedText type="defaultSemiBold">FAQ rapide</ThemedText>
        <ThemedText style={{ color: mutedText }}>
          Retrouve les réponses aux questions fréquentes sur les pronostics et les cotes.
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 24,
    gap: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
});
