// Le code qui centralise la palette de couleurs et les polices de l'app.
import { Platform } from 'react-native';

const tintColorLight = '#1B5BFF';
const tintColorDark = '#3FA0FF';

export const Colors = {
  light: {
    text: '#0B1220',
    background: '#EFF3FB',
    backgroundSecondary: '#E1E8F5',
    card: '#FFFFFF',
    tint: tintColorLight,
    icon: '#2D3C5F',
    tabIconDefault: '#4B5A7D',
    tabIconSelected: tintColorLight,
    border: '#CBD6EA',
    mutedText: '#4B5A7D',
    success: '#1DBE71',
    warning: '#F4A11D',
    premium: '#7C5CFF',
    accent: '#3FA0FF',
    danger: '#E53E3E',
  },
  dark: {
    text: '#F5F8FF',
    background: '#0B1426',
    backgroundSecondary: '#121E35',
    card: '#16243F',
    tint: tintColorDark,
    icon: '#9FB0D3',
    tabIconDefault: '#8193B5',
    tabIconSelected: tintColorDark,
    border: '#243251',
    mutedText: '#9FB0D3',
    success: '#20C97A',
    warning: '#F5A623',
    premium: '#9B6BFF',
    accent: '#3FA0FF',
    danger: '#F87171',
  },
  nocturne: {
    text: '#F2F5FF',
    background: '#05070D',
    backgroundSecondary: '#0D1626',
    card: '#111B2E',
    tint: '#4C8DFF',
    icon: '#A7B4D6',
    tabIconDefault: '#7F8FB4',
    tabIconSelected: '#4C8DFF',
    border: '#1E2A45',
    mutedText: '#9AAAD0',
    success: '#1EC980',
    warning: '#F5A623',
    premium: '#9B6BFF',
    accent: '#3FA0FF',
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
