import '../global.css';

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { AlertProvider } from '../components/Alert/Alert';
import { AuthProvider, useAuth } from '../hooks/auth-context';
import { ColorSchemeProvider } from '../hooks/color-scheme-context';
import { useColorScheme } from '../hooks/use-color-scheme';

const AppNavigation = () => {
  const colorScheme = useColorScheme();
  const { status } = useAuth();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {status === 'loading' ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      ) : (
        <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
          <Stack.Protected guard={status === 'signedIn'}>
            <Stack.Screen name="index" />
            <Stack.Screen name="Access" />
            <Stack.Screen name="Machines" />
            <Stack.Screen name="Orders" />
            <Stack.Screen name="ComponentsDemo" />
            <Stack.Screen name="support" />
          </Stack.Protected>
          <Stack.Protected guard={status === 'signedOut'}>
            <Stack.Screen name="signIn" />
          </Stack.Protected>
        </Stack>
      )}
    </ThemeProvider>
  );
};

export const TabLayout = () => (
  <ColorSchemeProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <HeroUINativeProvider>
          <AlertProvider>
            <AuthProvider>
              <AppNavigation />
            </AuthProvider>
          </AlertProvider>
        </HeroUINativeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  </ColorSchemeProvider>
);

export default TabLayout;
