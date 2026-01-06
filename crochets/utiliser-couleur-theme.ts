/**
 * En savoir plus sur les modes clair et sombre :
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constantes/theme';
import { useSchemaCouleur } from '@/crochets/utiliser-schema-couleur';

export function useCouleurTheme(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useSchemaCouleur() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
