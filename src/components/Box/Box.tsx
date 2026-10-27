import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { Typography } from '../Typography/Typography';
import { styles } from './style';

export const Box = ({
  title,
  description,
  children,
  style,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.section, { backgroundColor: theme.backgroundElement, borderColor: theme.border }, style]}>
      <View style={styles.sectionHeading}>
        {title ? <Typography text={title} variant='title' /> : null}
        {description ? <Typography text={description} variant='caption' /> : null}
      </View>
      {children}
    </View>
  );
};
