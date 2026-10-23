import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/use-theme';
import { ComponentsDemo } from '../../screens/ComponentsDemo';
import { Home } from '../../screens/Home';
import { SignIn } from '../../screens/SignIn';
import { Button } from '../Buttons/Buttons';
import { styles } from './style';

const dev = process.env.EXPO_PUBLIC_DEV_MODE === 'true';
const devDemo = dev ? { label: 'Demo', Screen: ComponentsDemo } : null;

const routes = [
  { label: 'Home', Screen: Home },
  { label: 'Sign in', Screen: SignIn },
];

type Route = (typeof routes)[number];

export const Router = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [activeRoute, setActiveRoute] = useState<Route>(routes[0]);
  const ActiveScreen = activeRoute.Screen;
  const allRoutes = devDemo ? [...routes, devDemo] : routes;
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.content, { backgroundColor: theme.background }]}>
        <ActiveScreen />
      </View>
      <View
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
      </View>
    </View>
  );
};