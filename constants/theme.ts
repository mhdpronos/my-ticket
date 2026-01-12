// Le code qui centralise la palette de couleurs et les polices de l'app.
import { Platform } from 'react-native';

const tintColorLight = '#2A6CFF';
const tintColorDark = '#2E7BFF';

export const Colors = {
  light: {
    text: '#0A1326',
    background: '#E9EEF7',
    backgroundSecondary: '#D8E1F0',
    card: '#FFFFFF',
    tint: tintColorLight,
    icon: '#2C3B5D',
    tabIconDefault: '#5C6B8B',
    tabIconSelected: tintColorLight,
    border: '#C7D2E6',
    mutedText: '#5C6B8B',
    success: '#1DBE71',
    warning: '#F5A623',
    premium: '#8B6BFF',
    accent: tintColorLight,
    danger: '#E94848',
  },
  dark: {
    text: '#E9F1FF',
    background: '#0A0F1F',
    backgroundSecondary: '#111B30',
    card: '#141F36',
    tint: tintColorDark,
    icon: '#9DB1D7',
    tabIconDefault: '#7F93B6',
    tabIconSelected: tintColorDark,
    border: '#1E2A45',
    mutedText: '#9DB1D7',
    success: '#1FCB7A',
    warning: '#F5A623',
    premium: '#9B7BFF',
    accent: tintColorDark,
    danger: '#F87171',
  },
  nocturne: {
    text: '#EDF2FF',
    background: '#05070F',
    backgroundSecondary: '#0B1426',
    card: '#0F1A30',
    tint: '#2D7CFF',
    icon: '#A4B3D6',
    tabIconDefault: '#7C8FB6',
    tabIconSelected: '#2D7CFF',
    border: '#1A2742',
    mutedText: '#9AAAD1',
    success: '#1FCB7A',
    warning: '#F5A623',
    premium: '#9B7BFF',
    accent: '#2D7CFF',
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
