import { House, MessageCircleText, PcCase, ShieldUser } from 'lucide-react-native';
import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import { useKeyboardState } from 'react-native-keyboard-controller';
import Animated, {
  Easing,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as C from '../../components';
import { needsSetup } from '../../helpers/setup';
import { useTheme } from '../../hooks/use-theme';
import { Access } from '../../screens/Access';
// import { ComponentsDemo } from '../../screens/ComponentsDemo';
import { Home } from '../../screens/Home';
import { Machines } from '../../screens/Machines';
import { SetupPage } from '../../screens/Setup/SetupPage';
import { Support } from '../../screens/Support';
import * as Ls from '../../storage';
import { Button } from '../Buttons/Buttons';
import { styles } from './style';

const routes = [
  { label: 'Home', Screen: Home, Icon: House },
  { label: 'Machines', Screen: Machines, Icon: PcCase },
  { label: 'Access', Screen: Access, Icon: ShieldUser },
  { label: 'Support', Screen: Support, Icon: MessageCircleText },
  // { label: 'Components Demo', Screen: ComponentsDemo, Icon: CircleQuestionMark },
];

type Route = (typeof routes)[number];
type ScreenProps = {
  onEditSetup?: () => void;
  onOpenSupport?: () => void;
};

export const Router = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const keyboardVisible = useKeyboardState((state) => state.isVisible);
  const [setupRequired, setSetupRequired] = useState<boolean | null>(null);
  const [activeRoute, setActiveRoute] = useState<Route>(routes[0]);
  const [transitionDirection, setTransitionDirection] = useState<1 | -1>(1);
  const [hasNavigated, setHasNavigated] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<Route | null>(null);
  const [editingSetup, setEditingSetup] = useState(false);
  const [setupSkipped, setSetupSkipped] = useState(false);
  const ActiveScreen = activeRoute.Screen as ComponentType<ScreenProps>;
  const selectRoute = (route: Route) => {
    if (pendingRoute) return;

    const currentIndex = routes.indexOf(activeRoute);
    const nextIndex = routes.indexOf(route);
    if (nextIndex === currentIndex) return;

    setTransitionDirection(nextIndex > currentIndex ? 1 : -1);
    setHasNavigated(true);
    setPendingRoute(route);
  };
  const swipeGesture = usePanGesture({
    enabled: pendingRoute === null,
    activeOffsetX: [-15, 15],
    failOffsetY: [-15, 15],
    runOnJS: true,
    onDeactivate: (event) => {
      if (
        event.canceled ||
        Math.abs(event.translationX) < 60 ||
        Math.abs(event.translationX) <= Math.abs(event.translationY)
      ) {
        return;
      }

      const currentIndex = routes.indexOf(activeRoute);
      const nextIndex = currentIndex + (event.translationX < 0 ? 1 : -1);
      if (nextIndex >= 0 && nextIndex < routes.length) {
        selectRoute(routes[nextIndex]);
      }
    },
  });
  const openSupport = () => {
    const supportRoute = routes.find((route) => route.label === 'Support');
    if (supportRoute) selectRoute(supportRoute);
  };

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

  useEffect(() => {
    if (!pendingRoute) return;

    const frame = requestAnimationFrame(() => {
      setActiveRoute(pendingRoute);
      setPendingRoute(null);
    });

    return () => cancelAnimationFrame(frame);
  }, [pendingRoute]);

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

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <GestureDetector gesture={swipeGesture}>
        <Animated.View
          key={activeRoute.label}
          entering={
            hasNavigated
              ? transitionDirection > 0
                ? SlideInRight.duration(500).easing(Easing.out(Easing.cubic))
                : SlideInLeft.duration(500).easing(Easing.out(Easing.cubic))
              : undefined
          }
          exiting={
            pendingRoute
              ? transitionDirection > 0
                ? SlideOutLeft.duration(200).easing(Easing.out(Easing.cubic))
                : SlideOutRight.duration(200).easing(Easing.out(Easing.cubic))
              : undefined
          }
          style={[styles.content, { backgroundColor: theme.background }]}
        >
          <ActiveScreen
            onEditSetup={() => setEditingSetup(true)}
            onOpenSupport={openSupport}
          />
        </Animated.View>
      </GestureDetector>
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
            icon={
                <route.Icon
                  size={24}
                  color={route === activeRoute ? theme.background : theme.textSecondary}
                />
            }
            variant={route === activeRoute ? 'primary' : 'secondary'}
            onPress={() => selectRoute(route)}
          />
        ))}
      </View>}
    </View>
  );
};