import { ScrollView, StyleSheet, View } from 'react-native';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

const historyItems = [
  { id: '1', activity: 'Connexion réussie', detail: 'Abidjan, CI • iPhone 15 Pro', date: 'Aujourd’hui, 09:42' },
  { id: '2', activity: 'Connexion réussie', detail: 'Bouaké, CI • Pixel 8', date: 'Hier, 21:18' },
  { id: '3', activity: 'Tentative bloquée', detail: 'Paris, FR • Web', date: '12 Sep, 18:05' },
];

export default function LoginHistoryScreen() {
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const warning = useThemeColor({}, 'warning');

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ScreenHeader title="Historique des connexions" subtitle="Surveille les accès récents à ton compte." />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {historyItems.map((item) => (
          <View key={item.id} style={[styles.card, { backgroundColor: card, borderColor: border }]}>
            <ThemedText type="defaultSemiBold">{item.activity}</ThemedText>
            <ThemedText style={{ color: mutedText }}>{item.detail}</ThemedText>
            <ThemedText style={{ color: item.activity.includes('bloquée') ? warning : mutedText }}>{item.date}</ThemedText>
          </View>
        ))}
        <ThemedText style={{ color: mutedText }}>
          Si une activité te semble suspecte, change ton mot de passe immédiatement.
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
    gap: 6,
  },
});
