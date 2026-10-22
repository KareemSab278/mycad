import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import { styles } from './style';

export type SeparatorVariant = 'sm' | 'md' | 'lg';

// Use as a horizontal visual divider; size controls its line thickness.
export const Separator = ({
  variant = 'sm',
  color,
  style,
}: {
  variant?: SeparatorVariant;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) => {
  const thickness = {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
  }[variant];

  return (
    <View
      accessibilityRole="none"
      style={[styles.separator, thickness, color ? { backgroundColor: color } : undefined, style]}
    />
  );
};
