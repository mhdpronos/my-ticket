import { ScrollView, StyleSheet, View } from 'react-native';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

const sessions = [
  { id: '1', device: 'iPhone 15 Pro', location: 'Abidjan, CI', lastActive: 'Actif maintenant' },
  { id: '2', device: 'Pixel 8', location: 'Bouaké, CI', lastActive: 'Il y a 2 heures' },
];

export default function SessionsScreen() {
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ScreenHeader title="Sessions actives" subtitle="Gère les appareils connectés à ton compte." />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {sessions.map((session) => (
          <View key={session.id} style={[styles.card, { backgroundColor: card, borderColor: border }]}>
            <ThemedText type="defaultSemiBold">{session.device}</ThemedText>
            <ThemedText style={{ color: mutedText }}>{session.location}</ThemedText>
            <ThemedText style={[styles.status, { color: tint }]}>{session.lastActive}</ThemedText>
          </View>
        ))}
        <ThemedText style={{ color: mutedText }}>
          Tu peux déconnecter un appareil depuis cette liste à tout moment.
        </ThemedText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 24,
  },
  content: {
    gap: 16,
    paddingBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  status: {
    marginTop: 6,
  },
});
