import type { TextProps } from 'react-native';
import { Text } from 'react-native';
import { styles } from './style';

export type TypographyVariant = 'caption' | 'body' | 'title' | 'heading';

// Use a variant to keep text sizing consistent throughout the app.
export const Typography = ({
  variant = 'body',
  text,
  style,
  ...props
}: TextProps & { variant?: TypographyVariant } & { text: string }) => {
  return <Text {...props} style={[styles.base, styles[variant], style]}>{text}</Text>;
};
