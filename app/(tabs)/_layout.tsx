import { Tabs } from 'expo-router';
import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, View } from 'react-native';

import { HapticTab } from '@/components/ui/HapticTab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const ticketCount = useAppStore((state) => state.ticketItems.length);
  const tint = Colors[colorScheme ?? 'light'].tint;
  const border = Colors[colorScheme ?? 'light'].border;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: 78,
          paddingTop: 8,
          paddingBottom: 14,
          borderTopColor: Colors[colorScheme ?? 'light'].border,
          backgroundColor: Colors[colorScheme ?? 'light'].card,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 6,
        },
        tabBarItemStyle: {
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}>
      <Tabs.Screen
        name="matches"
        options={{
          title: t('tabsMatches'),
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="soccer" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="top-picks"
        options={{
          title: t('tabsTopPicks'),
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="fire" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ticket"
        options={{
          title: t('tabsTicket'),
          tabBarIcon: () => (
            <View style={styles.ticketIconWrapper}>
              <View style={[styles.ticketIconCircle, { backgroundColor: tint, borderColor: border }]}>
                <MaterialCommunityIcons name="ticket-outline" size={28} color="#FFFFFF" />
              </View>
              {ticketCount > 0 ? (
                <View style={styles.ticketBadge}>
                  <Text style={styles.ticketBadgeText}>{ticketCount > 9 ? '9+' : ticketCount}</Text>
                </View>
              ) : null}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t('tabsFavorites'),
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="star-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabsProfile'),
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  ticketIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -6 }],
  },
  ticketIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  ticketBadge: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  ticketBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
