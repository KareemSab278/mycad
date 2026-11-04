import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useKeyboardState } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as C from '../../components';
import { needsSetup } from '../../helpers/setup';
import { useTheme } from '../../hooks/use-theme';
import { Access } from '../../screens/Access';
import { Accounts } from '../../screens/Accounts';
import { Home } from '../../screens/Home';
import { SetupPage } from '../../screens/Setup/SetupPage';
import * as Ls from '../../storage';
import { Button } from '../Buttons/Buttons';
import { styles } from './style';
// import { ComponentsDemo } from '../../screens/ComponentsDemo';

const dev = process.env.EXPO_PUBLIC_DEV_MODE === 'true';

const routes = [
  { label: 'Home', Screen: Home },
  { label: 'Account', Screen: Accounts },
  { label: 'Access', Screen: Access },
];

type Route = (typeof routes)[number];

export const Router = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const keyboardVisible = useKeyboardState((state) => state.isVisible);
  const [setupRequired, setSetupRequired] = useState<boolean | null>(null);
  const [activeRoute, setActiveRoute] = useState<Route>(routes[0]);
  const [editingSetup, setEditingSetup] = useState(false);
  const [setupSkipped, setSetupSkipped] = useState(false);
  const ActiveScreen = activeRoute.Screen as ComponentType<{ onEditSetup?: () => void }>;

  useEffect(() => {
    let active = true;
    void Ls.Creds.get().then((account) => {
      if (active) {
        setSetupRequired(needsSetup(account));
      }
    });

    return () => {
      active = false;
    };
  }, []);

  if (setupRequired === null) return <C.Loader />;
  if ((setupRequired && !setupSkipped) || editingSetup) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <SetupPage
          mode={setupRequired && !setupSkipped ? 'required' : 'edit'}
          onComplete={() => {
            if (!setupSkipped) setSetupRequired(false);
            setEditingSetup(false);
          }}
          onCancel={editingSetup ? () => setEditingSetup(false) : undefined}
          onSkip={setupRequired && !setupSkipped ? () => setSetupSkipped(true) : undefined}
        />
      </View>
    );
  }

  // const allRoutes = dev ? [...routes, { label: 'Demo', Screen: ComponentsDemo }] : routes;
  // const allRoutes = routes;
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.content, { backgroundColor: theme.background }]}>
        <ActiveScreen onEditSetup={() => setEditingSetup(true)} />
      </View>
      {!keyboardVisible && <View
        style={[
          styles.navigation,
          { backgroundColor: theme.backgroundElement, borderTopColor: theme.border },
          { paddingBottom: Math.max(insets.bottom, 24) },
        ]}
      >
        {routes.map((route) => (
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