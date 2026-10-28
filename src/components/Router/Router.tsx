import { useState } from 'react';
import { View } from 'react-native';
import { useKeyboardState } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/use-theme';
import { Access } from '../../screens/Access';
import { ComponentsDemo } from '../../screens/ComponentsDemo';
import { Home } from '../../screens/Home';
import { Button } from '../Buttons/Buttons';
import { styles } from './style';

const dev = process.env.EXPO_PUBLIC_DEV_MODE === 'true';
const devDemo = dev ? { label: 'Demo', Screen: ComponentsDemo } : null;

const routes = [
  { label: 'Home', Screen: Home },
  { label: 'Access', Screen: Access },
];

type Route = (typeof routes)[number];

export const Router = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const keyboardVisible = useKeyboardState((state) => state.isVisible);
  const [activeRoute, setActiveRoute] = useState<Route>(routes[0]);
  const ActiveScreen = activeRoute.Screen;
  const allRoutes = devDemo ? [...routes, devDemo] : routes;
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.content, { backgroundColor: theme.background }]}>
        <ActiveScreen />
      </View>
      {!keyboardVisible && <View
        style={[
          styles.navigation,
          { backgroundColor: theme.backgroundElement, borderTopColor: theme.border },
          { paddingBottom: Math.max(insets.bottom, 24) },
        ]}
      >
        {allRoutes.map((route) => (
          <Button
            key={route.label}
            label={route.label}
            variant={route === activeRoute ? 'primary' : 'secondary'}
            style={styles.navigationButton}
            onPress={() => setActiveRoute(route)}
          />
        ))}
      </View>}
    </View>
  );
};