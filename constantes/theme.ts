/**
 * Voici les couleurs utilisées dans l'application. Elles sont définies pour les modes clair et sombre.
 * Il existe d'autres façons de styliser l'app (Nativewind, Tamagui, unistyles, etc.).
 */

import { Platform } from 'react-native';

const tintColorLight = '#1f6feb';
const tintColorDark = '#5fa8ff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#F7F9FC',
    backgroundSecondary: '#FFFFFF',
    card: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    border: '#E6E9EF',
    mutedText: '#667085',
    success: '#16A34A',
    warning: '#F59E0B',
    premium: '#111827',
  },
  dark: {
    text: '#ECEDEE',
    background: '#0B0E14',
    backgroundSecondary: '#121725',
    card: '#161B2E',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: '#1F2937',
    mutedText: '#9CA3AF',
    success: '#22C55E',
    warning: '#F59E0B',
    premium: '#F8FAFC',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS : `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS : `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS : `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS : `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
