import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useRef, useState } from 'react';
import { useScrollToTop } from '@react-navigation/native';

import { TicketItemRow } from '@/components/ticket/TicketItemRow';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { TicketItem } from '@/types';

export default function TicketScreen() {
  const ticketItems = useAppStore((state) => state.ticketItems);
  const removeTicketItem = useAppStore((state) => state.removeTicketItem);
  const clearTicket = useAppStore((state) => state.clearTicket);
  const listRef = useRef<FlatList<TicketItem>>(null);

  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');
  const { t } = useTranslation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    requestAnimationFrame(() => setIsRefreshing(false));
  }, []);

  useScrollToTop(listRef);

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.header}>
        <View style={[styles.titleBar, { backgroundColor: tint }]}>
          <ThemedText type="title" style={styles.titleText}>
            {t('tabsTicket')}
          </ThemedText>
        </View>
        <ThemedText style={[styles.subtitleText, { color: mutedText }]}>{t('headerTicketSubtitle')}</ThemedText>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={clearTicket}
          style={[styles.clearButton, { borderColor: border, backgroundColor: card }]}>
          <MaterialCommunityIcons name="broom" size={18} color={mutedText} />
          <ThemedText style={{ color: mutedText }}>{t('buttonClear')}</ThemedText>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={listRef}
        data={ticketItems}
        keyExtractor={(item) => item.match.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TicketItemRow item={item} onRemove={() => removeTicketItem(item.match.id)} />
        )}
        ListEmptyComponent={
          <View style={[styles.emptyCard, { borderColor: border, backgroundColor: card }]}>
            <ThemedText type="defaultSemiBold">{t('ticketEmptyTitle')}</ThemedText>
            <ThemedText style={{ color: mutedText }}>{t('ticketEmptySubtitle')}</ThemedText>
          </View>
        }
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={tint} />}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 16,
    gap: 10,
    alignItems: 'center',
  },
  titleBar: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  titleText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitleText: {
    textAlign: 'center',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'center',
  },
  list: {
    gap: 12,
    paddingBottom: 20,
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
});
