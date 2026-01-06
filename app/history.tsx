import { FlatList, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

const historyItems = [
  { id: 'hist-1', label: 'PSG vs Lyon', result: 'Ticket gagné' },
  { id: 'hist-2', label: 'Barcelona vs Sevilla', result: 'Ticket perdu' },
  { id: 'hist-3', label: 'Chelsea vs Arsenal', result: 'Ticket gagné' },
];

export default function HistoryScreen() {
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <FlatList
        data={historyItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderColor: border, backgroundColor: card }]}>
            <MaterialCommunityIcons name="history" size={20} color={mutedText} />
            <View style={styles.textBlock}>
              <ThemedText type="defaultSemiBold">{item.label}</ThemedText>
              <ThemedText style={{ color: mutedText }}>{item.result}</ThemedText>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={[styles.card, { borderColor: border, backgroundColor: card }]}>
            <ThemedText type="defaultSemiBold">Aucun historique</ThemedText>
            <ThemedText style={{ color: mutedText }}>Tes tickets passés apparaîtront ici.</ThemedText>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
});
