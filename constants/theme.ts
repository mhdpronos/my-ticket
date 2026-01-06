// Le code qui centralise la palette de couleurs et les polices de l'app.
import { Platform } from 'react-native';

const tintColorLight = '#2F5BFF';
const tintColorDark = '#5B8CFF';

export const Colors = {
  light: {
    text: '#0B1020',
    background: '#F3F6FF',
    backgroundSecondary: '#E8EDFF',
    card: '#FFFFFF',
    tint: tintColorLight,
    icon: '#3E4C6B',
    tabIconDefault: '#5A6B8C',
    tabIconSelected: tintColorLight,
    border: '#D7E0FF',
    mutedText: '#546079',
    success: '#18B86F',
    warning: '#F5A524',
    premium: '#8B5CF6',
    accent: '#FF3B6A',
    danger: '#EF4444',
  },
  dark: {
    text: '#F8FAFF',
    background: '#0A0F1E',
    backgroundSecondary: '#141A2E',
    card: '#1A2240',
    tint: tintColorDark,
    icon: '#A9B5D1',
    tabIconDefault: '#8B96B4',
    tabIconSelected: tintColorDark,
    border: '#2B3552',
    mutedText: '#A9B5D1',
    success: '#22C55E',
    warning: '#F59E0B',
    premium: '#A855F7',
    accent: '#FF5C8D',
    danger: '#F87171',
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
