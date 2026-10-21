import { View } from 'react-native';
import type { ViewProps, ViewStyle } from 'react-native';
import type { StyleProp } from 'react-native';
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
  return (
    <View
      {...props}
      accessibilityLabel="Loading content"
      style={[styles.skeleton, { width, height }, style]}
    />
  );
};
