import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';

const sessions = [
  { id: '1', device: 'iPhone 15 Pro', location: 'Abidjan, CI', lastActive: { fr: 'Actif maintenant', en: 'Active now' } },
  { id: '2', device: 'Pixel 8', location: 'Bouaké, CI', lastActive: { fr: 'Il y a 2 heures', en: '2 hours ago' } },
];

export default function SessionsScreen() {
  const [items, setItems] = useState(sessions);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasFocusedOnce = useRef(false);
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');
  const { t, language } = useTranslation();

  const reloadSessions = useCallback(async () => {
    setIsRefreshing(true);
    setItems([...sessions]);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    setItems([...sessions]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!hasFocusedOnce.current) {
        hasFocusedOnce.current = true;
        return;
      }
      reloadSessions();
    }, [reloadSessions])
  );

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ScreenHeader title={t('sessionsTitle')} subtitle={t('sessionsSubtitle')} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={reloadSessions} tintColor={tint} />}>
        {items.map((session) => (
          <View key={session.id} style={[styles.card, { backgroundColor: card, borderColor: border }]}>
            <ThemedText type="defaultSemiBold">{session.device}</ThemedText>
            <ThemedText style={{ color: mutedText }}>{session.location}</ThemedText>
            <ThemedText style={[styles.status, { color: tint }]}>{session.lastActive[language]}</ThemedText>
          </View>
        ))}
        <ThemedText style={{ color: mutedText }}>{t('sessionsHint')}</ThemedText>
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
