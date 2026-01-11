import { useColorScheme as useNativeColorScheme } from 'react-native';

import { useAppStore } from '@/store/useAppStore';

export function useColorScheme() {
  const systemScheme = useNativeColorScheme() ?? 'light';
  const themePreference = useAppStore((state) => state.themePreference);

  if (themePreference === 'system') {
    return systemScheme;
  }

  if (themePreference === 'light') {
    return 'light';
  }

  if (themePreference === 'dark' || themePreference === 'nocturne') {
    return 'dark';
  }

  return systemScheme;
}
