import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useColorSchemePreference } from './color-scheme-context';

export const useColorScheme = () => {
  const systemColorScheme = useSystemColorScheme();
  const { preference } = useColorSchemePreference();

  return preference ?? systemColorScheme;
};
