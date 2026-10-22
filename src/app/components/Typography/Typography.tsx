import type { CSSProperties } from 'react';
import { Text } from 'react-native';
import { styles } from './style';


interface TypographyProps {
  variant?: 'caption' | 'body' | 'title' | 'heading';
  text: string;
  style?: CSSProperties;
}

// Use a variant to keep text sizing consistent throughout the app.
export const Typography = ({
  variant = 'body',
  text,
  style,
}: TypographyProps) => {
  return <Text style={[styles.base,...(Array.isArray(style) ? style : [style]), styles[variant]]}>{text}</Text>;
};
