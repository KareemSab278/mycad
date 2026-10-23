
import { ScrollView } from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { styles } from './style';

export const Container = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
    >
      {children}
    </ScrollView>
  );
};