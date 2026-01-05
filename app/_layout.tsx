import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useSchemaCouleur } from '@/crochets/utiliser-schema-couleur';
import { TicketProvider } from '@/etat/etat-ticket';

export const unstable_settings = {
  anchor: '(onglets)',
};

export default function RootLayout() {
  const colorScheme = useSchemaCouleur();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TicketProvider>
        <Stack>
          <Stack.Screen name="(onglets)" options={{ headerShown: false }} />
          <Stack.Screen
            name="fenetre-modale"
            options={{ presentation: 'modal', title: 'Fenêtre modale' }}
          />
        </Stack>
        <StatusBar style="auto" />
      </TicketProvider>
    </ThemeProvider>
  );
}
