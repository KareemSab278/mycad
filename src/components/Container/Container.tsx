import type { ScrollViewProps } from 'react-native';
import { Platform, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useTheme } from '../../hooks/use-theme';
import { styles } from './style';

export const Container = ({ children, style, contentContainerStyle, ...props }: ScrollViewProps) => {
  const theme = useTheme();
  const scrollProps: ScrollViewProps = {
    ...props,
    keyboardShouldPersistTaps: props.keyboardShouldPersistTaps ?? 'handled',
    style: [{ backgroundColor: theme.background }, style],
    contentContainerStyle: [styles.container, { backgroundColor: theme.background }, contentContainerStyle],
  };

  if (Platform.OS === 'web') {
    return <ScrollView {...scrollProps}>{children}</ScrollView>;
  }

  return <KeyboardAwareScrollView {...scrollProps} bottomOffset={24} mode="layout">{children}</KeyboardAwareScrollView>;
};