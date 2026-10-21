import type { ButtonRootProps } from 'heroui-native';
import { Button as HeroButton } from 'heroui-native';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { styles } from './style';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonProps = Omit<
  ButtonRootProps,
  'animation' | 'children' | 'feedbackVariant' | 'style' | 'variant'
> & {
  label?: string;
  children?: ReactNode;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
};

// Example: <Button variant="danger" onPress={removeItem}>Delete</Button>.
export const Button = ({
  children,
  label,
  variant = 'primary',
  style,
  ...props
}: ButtonProps) => {
  const heroVariant =
    variant === 'secondary' || variant === 'ghost' ? 'primary' : variant;
  const buttonStyle = [
    styles.button,
    variant === 'secondary' && styles.secondary,
    variant === 'ghost' && styles.ghost,
    style,
  ];
  const labelStyle =
    variant === 'secondary'
      ? styles.secondaryLabel
      : variant === 'ghost'
        ? styles.ghostLabel
        : undefined;

  return (
    <HeroButton
      {...props}
      style={buttonStyle}
      variant={heroVariant}
      feedbackVariant="scale-ripple"
      animation={{ scale: { value: 0.9, ignoreScaleCoefficient: true } }}
    >
      <HeroButton.Label style={labelStyle}>{label ?? children}</HeroButton.Label>
    </HeroButton>
  );
};


const buildButton = (variant: ButtonVariant) => (props: Omit<ButtonProps, 'variant'>) => (
  <Button {...props} variant={variant} />
);

export const PrimaryButton = buildButton('primary');
export const SecondaryButton = buildButton('secondary');
export const DangerButton = buildButton('danger');
export const GhostButton = buildButton('ghost');

export const Buttons = {
  Primary: PrimaryButton,
  Secondary: SecondaryButton,
  Danger: DangerButton,
  Ghost: GhostButton,
};
