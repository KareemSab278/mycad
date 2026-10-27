import { Portal } from 'heroui-native';
import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  Platform,
  Pressable,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '../Typography/Typography';
import { styles } from './style';

export type AlertTone = 'info' | 'success' | 'warning' | 'error';

const ALERT_DURATION = 5000;
const ANIMATION_DURATION = 500;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AlertProps {
  title?: string;
  message: string;
  tone?: AlertTone;
}

type AlertEntry = AlertProps & { id: string; tone: AlertTone };
type AlertContextValue = {
  add: (alert: AlertEntry) => void;
  remove: (id: string) => void;
};

const AlertContext = createContext<AlertContextValue | null>(null);

const AlertItem = ({ id, title, message, tone, onDismiss }: AlertEntry & { onDismiss: (id: string) => void }) => {
  const { width } = useWindowDimensions();
  const [translateX] = useState(() => new Animated.Value(-width));
  const [opacity] = useState(() => new Animated.Value(0));
  const dismissing = useRef(false);

  const dismiss = useCallback(() => {
    if (dismissing.current) return;
    dismissing.current = true;
    Animated.parallel([
      Animated.timing(translateX, {
        duration: ANIMATION_DURATION,
        toValue: -width,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        duration: ANIMATION_DURATION,
        toValue: 0,
        useNativeDriver: false,
      }),
    ]).start(({ finished }) => {
      if (finished) onDismiss(id);
    });
  }, [id, onDismiss, opacity, translateX, width]);

  useEffect(() => {
    dismissing.current = false;
    translateX.setValue(-width);
    Animated.parallel([
      Animated.timing(translateX, {
        duration: ANIMATION_DURATION,
        toValue: 0,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        duration: ANIMATION_DURATION,
        toValue: 1,
        useNativeDriver: false,
      }),
    ]).start();
    const timeout = setTimeout(dismiss, ALERT_DURATION);

    return () => {
      clearTimeout(timeout);
      translateX.stopAnimation();
      opacity.stopAnimation();
    };
  }, [dismiss, opacity, translateX, width]);

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={title ? `${title}. ${message}` : message}
      accessibilityHint="Dismiss alert"
      onPress={dismiss}
      style={[styles.container, styles[tone], { opacity, transform: [{ translateX }] }]}
    >
      {title ? <Typography text={title} style={{ color: '#000000', fontWeight: '600' }} /> : null}
      <Typography text={message} style={{ color: '#000000' }} />
    </AnimatedPressable>
  );
};


export const AlertProvider = ({ children }: PropsWithChildren) => {
  const insets = useSafeAreaInsets();
  const [alerts, setAlerts] = useState<AlertEntry[]>([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const add = useCallback((alert: AlertEntry) => {
    setAlerts((current) => [
      ...current.filter((item) => item.id !== alert.id),
      alert,
    ]);
  }, []);

  const remove = useCallback((id: string) => {
    setAlerts((current) => current.filter((item) => item.id !== id));
  }, []);

  const context = useMemo(() => ({ add, remove }), [add, remove]);

  return (
    <AlertContext.Provider value={context}>
      {children}

      {alerts.length > 0 && (
        <Portal name="mycad-alerts">
          <View
            pointerEvents="box-none"
            style={[
              styles.overlay,
              {
                bottom: keyboardHeight > 0
                  ? keyboardHeight + 12
                  : insets.bottom + 100,
              },
            ]}
          >
            {alerts.map((alert) => (
              <AlertItem key={alert.id} {...alert} onDismiss={remove} />
            ))}
          </View>
        </Portal>
      )}
    </AlertContext.Provider>
  );
};

export const Alert = ({ title, message, tone = 'info' }: AlertProps) => {
  const id = useId();
  const context = useContext(AlertContext);
  if (!context) throw new Error('Alert must be used within AlertProvider.');
  const { add, remove } = context;

  useEffect(() => {
    add({ id, title, message, tone });
    return () => remove(id);
  }, [add, id, message, remove, title, tone]);

  return null;
};
