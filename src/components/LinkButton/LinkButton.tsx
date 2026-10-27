import type { ReactNode } from 'react';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import { Pressable } from 'react-native';
import { Typography } from '../Typography/Typography';
import { styles } from './style';

type LinkButtonProps = Omit<
  PressableProps,
  'children' | 'style'
> & {
  text: string;
  children?: ReactNode;
  isDisabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const LinkButton = ({
  text,
  onPress,
  disabled,
  isDisabled,
  children,
  style,
  ...props
}: LinkButtonProps) => {
  return (
    <Pressable
      {...props}
      accessibilityRole="link"
      onPress={onPress}
      disabled={disabled || isDisabled}
      style={[styles.link, style]}
    >
      <Typography text={text} variant="link" />
      {children}
    </Pressable>
  );
};
