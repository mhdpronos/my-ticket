import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AppProviders } from '@/store/AppProviders';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <AppProviders>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
          <Stack.Screen name="subscription" options={{ title: 'Abonnement' }} />
          <Stack.Screen name="history" options={{ title: 'Historique' }} />
          <Stack.Screen name="settings" options={{ title: 'Réglages' }} />
          <Stack.Screen name="support" options={{ title: 'Aide & Support' }} />
          <Stack.Screen name="legal" options={{ title: 'Mentions légales' }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="match-details" options={{ title: 'Détails match' }} />
        </Stack>
        <StatusBar style="light" />
      </AppProviders>
    </ThemeProvider>
  );
}
