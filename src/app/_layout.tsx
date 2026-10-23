import '../global.css';

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { HeroUINativeProvider } from 'heroui-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ColorSchemeProvider } from './hooks/color-scheme-context';
import { useColorScheme } from './hooks/use-color-scheme';

// pages
// import { Home } from './Pages/Home';

SplashScreen.preventAutoHideAsync();

const AppNavigation = () => {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
};

export const TabLayout = () => (
  <ColorSchemeProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <AppNavigation />
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  </ColorSchemeProvider>
);

export default TabLayout;
