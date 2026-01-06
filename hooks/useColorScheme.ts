import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

type ColorScheme = keyof typeof Colors;

export const useAppColorScheme = (): ColorScheme => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? 'dark' : 'dark';
};
