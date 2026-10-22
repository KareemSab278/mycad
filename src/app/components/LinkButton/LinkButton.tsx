import type { ComponentProps, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Text } from 'react-native';
import { PressableFeedback } from '../PressableFeedback/PressableFeedback';
import { styles } from './style';

type LinkButtonProps = Omit<
  ComponentProps<typeof PressableFeedback>,
  'children' | 'style'
> & {
  text: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const LinkButton = ({
  text,
  onPress,
  children,
  style,
  ...props
}: LinkButtonProps) => {
  return (
    <PressableFeedback
      {...props}
      accessibilityRole="link"
      onPress={onPress}
      style={[styles.link, style]}
    >
      <Text style={styles.label}>{text}</Text>
      {children}
    </PressableFeedback>
  );
};
