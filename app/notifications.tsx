import { FlatList, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

const notifications = [
  {
    id: 'notif-1',
    title: 'Cote boostée disponible',
    description: 'Barça vs Sevilla • 1xBet propose 1.60',
  },
  {
    id: 'notif-2',
    title: 'Nouveau ticket publié',
    description: 'MHD Pronos a partagé un ticket Safe',
  },
  {
    id: 'notif-3',
    title: 'Match en approche',
    description: 'PSG vs Lyon commence dans 2 heures',
  },
];

export default function NotificationsScreen() {
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ScreenHeader title="Notifications" subtitle="Reste informé des mises à jour clés." />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderColor: border, backgroundColor: card }]}>
            <MaterialCommunityIcons name="bell-ring-outline" size={20} color={tint} />
            <View style={styles.textBlock}>
              <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
              <ThemedText style={{ color: mutedText }}>{item.description}</ThemedText>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={[styles.card, { borderColor: border, backgroundColor: card }]}>
            <ThemedText type="defaultSemiBold">Aucune notification</ThemedText>
            <ThemedText style={{ color: mutedText }}>Tout est calme pour le moment.</ThemedText>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 12,
  },
  list: {
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
});
