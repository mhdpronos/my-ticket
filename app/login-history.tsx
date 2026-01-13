import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';

const historyItems = [
  { id: '1', activity: 'success', detail: 'Abidjan, CI • iPhone 15 Pro', date: { fr: 'Aujourd’hui, 09:42', en: 'Today, 09:42' } },
  { id: '2', activity: 'success', detail: 'Bouaké, CI • Pixel 8', date: { fr: 'Hier, 21:18', en: 'Yesterday, 21:18' } },
  { id: '3', activity: 'blocked', detail: 'Paris, FR • Web', date: { fr: '12 Sep, 18:05', en: 'Sep 12, 18:05' } },
];

export default function LoginHistoryScreen() {
  const [items, setItems] = useState(historyItems);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasFocusedOnce = useRef(false);
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const warning = useThemeColor({}, 'warning');
  const { t, language } = useTranslation();

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
      <ScreenHeader title={t('loginHistoryTitle')} subtitle={t('loginHistorySubtitle')} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={reloadHistory} />}
        contentInsetAdjustmentBehavior="never">
        {items.map((item) => (
          <View key={item.id} style={[styles.card, { backgroundColor: card, borderColor: border }]}>
            <ThemedText type="defaultSemiBold">
              {item.activity === 'blocked' ? t('loginHistoryBlocked') : t('loginHistorySuccess')}
            </ThemedText>
            <ThemedText style={{ color: mutedText }}>{item.detail}</ThemedText>
            <ThemedText style={{ color: item.activity === 'blocked' ? warning : mutedText }}>
              {item.date[language]}
            </ThemedText>
          </View>
        ))}
        <ThemedText style={{ color: mutedText }}>{t('loginHistoryHint')}</ThemedText>
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
