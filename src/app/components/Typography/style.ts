import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';

type TextColors = { text: string; textSecondary: string; button: string };

const createStyles = (colors: TextColors) =>
  StyleSheet.create({
    base: {
      color: colors.text,
    },
    caption: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    heading: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 36,
    },
    link: {
      color: colors.button,
      fontSize: 12,
    },
  });

export const lightStyles = createStyles(Colors.light);
export const darkStyles = createStyles(Colors.dark);
