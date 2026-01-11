import { useColorScheme as useNativeColorScheme } from 'react-native';

import { useAppStore } from '@/store/useAppStore';

type ThemeName = 'light' | 'dark' | 'nocturne';

export function useColorScheme() {
  const themePreference = useAppStore((state) => state.themePreference);
  const systemScheme = (useNativeColorScheme() ?? 'light') as ThemeName;

  if (themePreference === 'system') {
    return systemScheme;
  }

  return themePreference as ThemeName;
}
