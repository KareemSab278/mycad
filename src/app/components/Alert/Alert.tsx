import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, useWindowDimensions } from 'react-native';
import { Typography } from '../Typography/Typography';
import { styles } from './style';

export type AlertTone = 'info' | 'success' | 'warning' | 'error';

const ALERT_DURATION = 5000;
const ANIMATION_DURATION = 600;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AlertProps {
  title?: string;
  message: string;
  tone?: AlertTone;
}

export const Alert = ({ title, message, tone = 'info' }: AlertProps) => {
  const { width: screenWidth } = useWindowDimensions();
  const [isVisible, setIsVisible] = useState(true);
  const translateX = useRef(new Animated.Value(-screenWidth)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDismissing = useRef(false);

  const dismiss = useCallback(() => {
    if (isDismissing.current) return;
    if (timeout.current !== null) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      isDismissing.current = true;
      Animated.parallel([
        Animated.timing(translateX, {
          duration: ANIMATION_DURATION,
          toValue: -screenWidth,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          duration: ANIMATION_DURATION,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setIsVisible(false);
        }
      });
    }, 0);
  }, [opacity, screenWidth, translateX]);

  useEffect(() => {
    isDismissing.current = false;
    translateX.setValue(-screenWidth);
    Animated.parallel([
      Animated.timing(translateX, {
        duration: ANIMATION_DURATION,
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        duration: ANIMATION_DURATION,
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    timeout.current = setTimeout(dismiss, ALERT_DURATION);

    return () => {
      if (timeout.current !== null) {
        clearTimeout(timeout.current);
      }
      translateX.stopAnimation();
      opacity.stopAnimation();
    };
  }, [dismiss, opacity, screenWidth, translateX]);

  if (!isVisible) {
    return null;
  }

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={title ? `${title}. ${message}` : message}
      accessibilityHint="Dismiss alert"
      onPress={dismiss}
      style={[
        styles.container,
        styles[tone],
        { opacity, transform: [{ translateX }] },
      ]}
    >
      {title ? <Typography text={title} style={{ color: '#000000', fontWeight: '600' }} /> : null}
      <Typography text={message} style={{ color: '#000000' }} />
    </AnimatedPressable>
  );
};
