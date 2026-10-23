import type { ComponentProps, ReactNode } from 'react';
import { PressableFeedback as HeroPressableFeedback } from 'heroui-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { styles } from './style';

type PressableFeedbackProps = Omit<
  ComponentProps<typeof HeroPressableFeedback>,
  'animation' | 'style'
> & {
  rippleColor?: string;
  style?: StyleProp<ViewStyle>;
};

// Wrap tappable content to provide a ripple and 0.9 press scale.
export const PressableFeedback = ({
  children,
  rippleColor,
  style,
  ...props
}: PressableFeedbackProps) => {
  return (
    <HeroPressableFeedback
      {...props}
      style={[styles.root, style]}
      animation={{ scale: { value: 0.9, ignoreScaleCoefficient: true } }}
    >
      {children}
      <HeroPressableFeedback.Ripple
        animation={rippleColor ? { backgroundColor: { value: rippleColor } } : undefined}
      />
    </HeroPressableFeedback>
  );
};
