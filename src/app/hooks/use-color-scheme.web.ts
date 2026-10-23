import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { useColorSchemePreference } from './color-scheme-context';

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export const useColorScheme = () => {
  const hasHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const colorScheme = useRNColorScheme();
  const { preference } = useColorSchemePreference();

  if (preference) {
    return preference;
  }
  if (hasHydrated) {
    return colorScheme;
  };

  return 'light';
}
