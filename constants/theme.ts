import { Platform } from 'react-native';

const tintColorLight = '#F97316';
const tintColorDark = '#FB923C';

export const Colors = {
  light: {
    text: '#1B1B1F',
    background: '#FFF7ED',
    backgroundSecondary: '#FFF2E1',
    card: '#FFFFFF',
    tint: tintColorLight,
    icon: '#6B7280',
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorLight,
    border: '#F4D9C6',
    mutedText: '#6B7280',
    success: '#16A34A',
    warning: '#F59E0B',
    premium: '#D97706',
    accent: '#EF4444',
  },
  dark: {
    text: '#F9FAFB',
    background: '#0B0B10',
    backgroundSecondary: '#15151F',
    card: '#1A1A26',
    tint: tintColorDark,
    icon: '#9CA3AF',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorDark,
    border: '#2C2C3A',
    mutedText: '#9CA3AF',
    success: '#22C55E',
    warning: '#F59E0B',
    premium: '#F59E0B',
    accent: '#F97316',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
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
