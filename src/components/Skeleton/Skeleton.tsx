import { View } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { styles } from './style';

type SkeletonProps = Omit<ViewProps, 'style'> & {
  width?: ViewStyle['width'];
  height?: number;
  style?: StyleProp<ViewStyle>;
};

// Use as a placeholder while content is loading.
export const Skeleton = ({
  width = '100%',
  height = 16,
  style,
  ...props
}: SkeletonProps) => {
  const theme = useTheme();

  return (
    <View
      {...props}
      accessibilityLabel="Loading content"
      style={[styles.skeleton, { width, height, backgroundColor: theme.backgroundSelected }, style]}
    />
  );
};
