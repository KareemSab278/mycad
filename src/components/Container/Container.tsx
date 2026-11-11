import type { ComponentRef } from 'react';
import type { ScrollViewProps } from 'react-native';
import { Platform, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useTheme } from '../../hooks/use-theme';
import { styles } from './style';

type ContainerProps = ScrollViewProps & {
  scrollViewRef?: (scrollView: ComponentRef<typeof ScrollView> | null) => void;
};

export const Container = ({
  children,
  style,
  contentContainerStyle,
  scrollViewRef,
  ...props
}: ContainerProps) => {
  const theme = useTheme();
  const scrollProps: ScrollViewProps = {
    ...props,
    keyboardShouldPersistTaps: props.keyboardShouldPersistTaps ?? 'handled',
    style: [{ backgroundColor: theme.background }, style],
    contentContainerStyle: [styles.container, { backgroundColor: theme.background }, contentContainerStyle],
  };

  if (Platform.OS === 'web') {
    return <ScrollView {...scrollProps} ref={scrollViewRef}>{children}</ScrollView>;
  }

  return <KeyboardAwareScrollView {...scrollProps} ref={scrollViewRef} bottomOffset={24} mode="layout">{children}</KeyboardAwareScrollView>;
};