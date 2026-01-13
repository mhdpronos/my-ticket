import { Tabs } from 'expo-router';
import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { HapticTab } from '@/components/ui/HapticTab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTranslation } from '@/hooks/useTranslation';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

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
          marginTop: 4,
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
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="ticket-outline" size={24} color={color} />,
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
