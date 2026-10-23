import type { CSSProperties } from 'react';
import { Text } from 'react-native';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { darkStyles, lightStyles } from './style';

interface TypographyProps {
  variant?: 'caption' | 'body' | 'title' | 'heading' | 'link';
  text: string;
  style?: CSSProperties;
}

// Use a variant to keep text sizing consistent throughout the app.
export const Typography = ({
  variant = 'body',
  text,
  style,
}: TypographyProps) => {
  const colorScheme = useColorScheme();
  const styles = colorScheme === 'dark' ? darkStyles : lightStyles;

  return (
    <Text style={[styles.base, styles[variant], ...(Array.isArray(style) ? style : [style])]}>
      {text}
    </Text>
  );
};
