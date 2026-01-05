import { Tabs } from 'expo-router';
import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { HeaderNotificationsButton } from '@/components/HeaderNotificationsButton';
import { Colors } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/useColorScheme';

export default function TabsLayout() {
  const colorScheme = useAppColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: Colors.dark.background },
        headerTitleStyle: { color: Colors.dark.text },
        headerTintColor: Colors.dark.text,
        headerRight: () => <HeaderNotificationsButton />,
        tabBarActiveTintColor: Colors[colorScheme].accent ?? Colors.dark.accent,
        tabBarInactiveTintColor: Colors[colorScheme].muted ?? Colors.dark.muted,
        tabBarStyle: { backgroundColor: Colors.dark.surface, borderTopColor: Colors.dark.border },
      }}
    >
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matchs',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="soccer" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ticket"
        options={{
          title: 'Ticket',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="ticket-confirmation-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoris',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="star-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
