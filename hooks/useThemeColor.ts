import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const propTheme: 'light' | 'dark' = theme === 'nocturne' ? 'dark' : theme;
  const colorFromProps = props[propTheme];

  if (colorFromProps) {
    return colorFromProps;
  }

  return Colors[theme][colorName];
}
