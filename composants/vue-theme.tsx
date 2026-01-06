import { View, type ViewProps } from 'react-native';

import { useCouleurTheme } from '@/crochets/utiliser-couleur-theme';

export type VueThemeProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function VueTheme({ style, lightColor, darkColor, ...otherProps }: VueThemeProps) {
  const backgroundColor = useCouleurTheme({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
