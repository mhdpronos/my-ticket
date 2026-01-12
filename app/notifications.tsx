import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';

const notifications = [
  {
    id: 'notif-1',
    title: 'notificationsBoostedOdds',
    description: 'notificationsBoostedOddsDetail',
  },
  {
    id: 'notif-2',
    title: 'notificationsNewTicket',
    description: 'notificationsNewTicketDetail',
  },
  {
    id: 'notif-3',
    title: 'notificationsMatchSoon',
    description: 'notificationsMatchSoonDetail',
  },
] as const;

export default function NotificationsScreen() {
  const [items, setItems] = useState(notifications);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasFocusedOnce = useRef(false);
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');
  const { t } = useTranslation();

  const reloadNotifications = useCallback(async () => {
    setIsRefreshing(true);
    setItems([...notifications]);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    setItems([...notifications]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!hasFocusedOnce.current) {
        hasFocusedOnce.current = true;
        return;
      }
      reloadNotifications();
    }, [reloadNotifications])
  );

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ScreenHeader title={t('notificationsTitle')} subtitle={t('notificationsSubtitle')} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderColor: border, backgroundColor: card }]}>
            <MaterialCommunityIcons name="bell-ring-outline" size={20} color={tint} />
            <View style={styles.textBlock}>
              <ThemedText type="defaultSemiBold">{t(item.title)}</ThemedText>
              <ThemedText style={{ color: mutedText }}>{t(item.description)}</ThemedText>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={[styles.card, { borderColor: border, backgroundColor: card }]}>
            <ThemedText type="defaultSemiBold">{t('notificationsEmptyTitle')}</ThemedText>
            <ThemedText style={{ color: mutedText }}>{t('notificationsEmptySubtitle')}</ThemedText>
          </View>
        }
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={reloadNotifications} tintColor={tint} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
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
