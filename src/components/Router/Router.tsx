import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ComponentsDemo } from '../../app/Screens/ComponentsDemo';
import { Home } from '../../app/Screens/Home';
import { SignIn } from '../../app/Screens/SignIn';
import { Button } from '../Buttons/Buttons';
import { styles } from './style';

const routes = [
  { label: 'Home', Screen: Home },
  { label: 'Sign in', Screen: SignIn },
  { label: 'Demo', Screen: ComponentsDemo },
] as const;

type Route = (typeof routes)[number];

export const Router = () => {
  const insets = useSafeAreaInsets();
  const [activeRoute, setActiveRoute] = useState<Route>(routes[0]);
  const ActiveScreen = activeRoute.Screen;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActiveScreen />
      </View>
      <View style={[styles.navigation, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {routes.map((route) => (
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