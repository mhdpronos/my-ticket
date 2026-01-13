import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';

const historyItems = [
  { id: 'hist-1', label: 'PSG vs Lyon', result: 'won' },
  { id: 'hist-2', label: 'Barcelona vs Sevilla', result: 'lost' },
  { id: 'hist-3', label: 'Chelsea vs Arsenal', result: 'won' },
];

export default function HistoryScreen() {
  const [items, setItems] = useState(historyItems);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasFocusedOnce = useRef(false);
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const { t } = useTranslation();

  const reloadHistory = useCallback(async () => {
    setIsRefreshing(true);
    setItems([...historyItems]);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    setItems([...historyItems]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!hasFocusedOnce.current) {
        hasFocusedOnce.current = true;
        return;
      }
      reloadHistory();
    }, [reloadHistory])
  );

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ScreenHeader title={t('ticketHistoryTitle')} subtitle={t('ticketHistorySubtitle')} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderColor: border, backgroundColor: card }]}>
            <MaterialCommunityIcons name="history" size={20} color={mutedText} />
            <View style={styles.textBlock}>
              <ThemedText type="defaultSemiBold">{item.label}</ThemedText>
              <ThemedText style={{ color: mutedText }}>
                {item.result === 'won' ? t('ticketWon') : t('ticketLost')}
              </ThemedText>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={[styles.card, { borderColor: border, backgroundColor: card }]}>
            <ThemedText type="defaultSemiBold">{t('ticketHistoryEmptyTitle')}</ThemedText>
            <ThemedText style={{ color: mutedText }}>{t('ticketHistoryEmptySubtitle')}</ThemedText>
          </View>
        }
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={reloadHistory} />}
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
    alignItems: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
});
