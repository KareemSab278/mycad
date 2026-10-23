import '@/global.css';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#101828',
    background: '#F9FAFB',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#EFF8FF',
    textSecondary: '#667085',
    border: '#EAECF0',
    overlay: 'rgba(16, 24, 40, 0.45)',
    button: '#208AEF',
    buttonText: '#FFFFFF',
    buttonDanger: '#FF3B30',
    buttonSecondary: '#4e4e4e',
    alerts: '#FFCC00',
  },
  dark: {
    text: '#F4F6FA',
    background: '#03050A',
    backgroundElement: '#141A24',
    backgroundSelected: '#252E3D',
    textSecondary: '#A8B1BF',
    border: '#293342',
    overlay: 'rgba(0, 0, 0, 0.78)',
    button: '#7CB8FF',
    buttonText: '#07111F',
    buttonDanger: '#FF3B30',
    buttonSecondary: '#4e4e4e',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
