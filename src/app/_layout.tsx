import '../global.css';

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { AlertProvider } from '../components/Alert/Alert';
import { ColorSchemeProvider } from '../hooks/color-scheme-context';
import { useColorScheme } from '../hooks/use-color-scheme';

// pages
// import { Home } from './Pages/Home';

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
      <KeyboardProvider>
        <HeroUINativeProvider>
          <AlertProvider>
            <AppNavigation />
          </AlertProvider>
        </HeroUINativeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  </ColorSchemeProvider>
);

export default TabLayout;
