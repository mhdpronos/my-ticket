// Repli pour utiliser MaterialIcons sur Android et le web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type SymboleIconeName = keyof typeof MAPPING;

/**
 * Ajoutez ici le mapping entre SF Symbols et Material Icons.
 * - voir Material Icons dans le [répertoire d'icônes](https://icons.expo.fyi).
 * - voir SF Symbols dans l'app [SF Symbols](https://developer.apple.com/sf-symbols/).
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as IconMapping;

/**
 * Composant d'icône : SF Symbols natifs sur iOS, Material Icons sur Android et web.
 * Cela garantit une apparence cohérente et une utilisation optimale des ressources.
 * Les `name` sont basés sur SF Symbols et nécessitent un mapping manuel.
 */
export function SymboleIcone({
  name,
  size = 24,
  color,
  style,
}: {
  name: SymboleIconeName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
