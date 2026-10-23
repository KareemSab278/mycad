import type { ActivityIndicatorProps, StyleProp, ViewStyle } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { styles } from './style';

type LoaderProps = Omit<ActivityIndicatorProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
};

export const Loader = ({ style, ...props }: LoaderProps) => {
  const theme = useTheme();

  return <ActivityIndicator {...props} color={props.color ?? theme.button} style={[styles.loader, style]} />;
};
