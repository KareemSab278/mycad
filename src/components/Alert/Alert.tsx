import { useEffect, useRef, useState } from 'react';
import { Animated, Text } from 'react-native';
import { styles } from './style';

export type AlertTone = 'info' | 'success' | 'warning' | 'error';

const ALERT_DURATION = 3000;
const ANIMATION_DURATION = 300;
const ENTRANCE_OFFSET = 48;

interface AlertProps {
  title?: string;
  message: string;
  tone?: AlertTone;
}

export const Alert = ({ title, message, tone = 'info' }: AlertProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const translateX = useRef(new Animated.Value(-ENTRANCE_OFFSET)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const width = useRef(0);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        duration: ANIMATION_DURATION,
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateX, {
          duration: ANIMATION_DURATION,
          toValue: -Math.max(width.current, ENTRANCE_OFFSET),
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
    }, ALERT_DURATION);

    return () => {
      clearTimeout(timeout);
      translateX.stopAnimation();
      opacity.stopAnimation();
    };
  }, [opacity, translateX]);

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      accessibilityRole="alert"
      onLayout={(event) => {
        width.current = event.nativeEvent.layout.width;
      }}
      style={[
        styles.container,
        styles[tone],
        { opacity, transform: [{ translateX }] },
      ]}
    >
    {title ? <Text style={styles.title}>{title}</Text> : null}
    <Text>{message}</Text>
    </Animated.View>
  );
};
