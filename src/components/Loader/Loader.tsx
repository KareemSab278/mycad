import type { ActivityIndicatorProps, StyleProp, ViewStyle } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { styles } from './style';

type LoaderProps = Omit<ActivityIndicatorProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
};

export const Loader = ({ style, ...props }: LoaderProps) => {
  return <ActivityIndicator {...props} style={[styles.loader, style]} />;
};
