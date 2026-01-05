import { Tabs } from 'expo-router';
import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { OngletHaptique } from '@/composants/onglet-haptique';
import { Colors } from '@/constantes/theme';
import { useSchemaCouleur } from '@/crochets/utiliser-schema-couleur';

export default function DispositionOnglets() {
  const colorScheme = useSchemaCouleur();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: OngletHaptique,
      }}>
      <Tabs.Screen
        name="matchs"
        options={{
          title: 'Matchs',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="soccer" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favoris"
        options={{
          title: 'Favoris',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="star-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="billet"
        options={{
          title: 'Billet',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="ticket-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="meilleurs-choix"
        options={{
          title: 'Meilleurs choix',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="crown-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="parametres"
        options={{
          title: 'Paramètres',
          href: null,
        }}
      />
    </Tabs>
  );
}
