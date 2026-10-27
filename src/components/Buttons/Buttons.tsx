import type { ButtonRootProps } from 'heroui-native';
import { Button as HeroButton } from 'heroui-native';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { styles } from './style';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'disabled';

type HeroButtonVariant = NonNullable<ButtonRootProps['variant']>;

interface VariantStyles {
  [key: string]: { button: StyleProp<ViewStyle>; hero: HeroButtonVariant, label: StyleProp<TextStyle> | undefined }
}

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type ButtonProps = DistributiveOmit<ButtonRootProps, 'variant' | 'feedbackVariant' | 'animation'> & {
  label?: string;
  children?: ReactNode;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
};

// Example: <Button variant="danger" onPress={removeItem}>Delete</Button>.
export const Button = ({ children, label, variant = 'primary', style, ...props }: ButtonProps) => {
  const theme = useTheme();

  const variants: VariantStyles = {
    'secondary': {
      button: [styles.secondary, { backgroundColor: theme.backgroundSelected }],
      hero: 'primary',
      label: [styles.secondaryLabel, { color: theme.text }],
    },
    'ghost': {
      button: styles.ghost,
      hero: 'primary',
      label: [styles.ghostLabel, { color: theme.button }],
    },
    'primary': { button: styles.button, hero: 'primary', label: undefined },
    'danger': { button: styles.button, hero: 'danger', label: undefined },
    'disabled': {
      button: [styles.disabled, { backgroundColor: theme.backgroundSelected }],
      hero: 'primary',
      label: [styles.disabledLabel, { color: theme.textSecondary }],
    }
  }

  return (
    <HeroButton
      {...props}
      style={[styles.button, variants[variant]?.button, style, { maxHeight: 50 }]}
      variant={variants[variant]?.hero ?? 'primary'}
      feedbackVariant="none"
    >
      <HeroButton.Label style={variants[variant]?.label}>{label ?? children}</HeroButton.Label>
    </HeroButton>
  );
};


const buildButton = (variant: ButtonVariant) => function VariantButton(props: DistributiveOmit<ButtonProps, 'variant'>) {
  if (props.isDisabled) {
    return <Button {...props} variant="disabled" />;
  }
  return (
    <Button {...props} variant={variant} />
  );
};

export const PrimaryButton = buildButton('primary');
export const SecondaryButton = buildButton('secondary');
export const DangerButton = buildButton('danger');
export const GhostButton = buildButton('ghost');
export const DisabledButton = buildButton('disabled');

export const Buttons = {
  Primary: PrimaryButton,
  Secondary: SecondaryButton,
  Danger: DangerButton,
  Ghost: GhostButton,
  Disabled: DisabledButton,
};
