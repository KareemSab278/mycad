import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { Typography } from '../Typography/Typography';
import { styles } from './style';

export const Box = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.section, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <View style={styles.sectionHeading}>
        <Typography text={title} variant='title' />
        {description ? <Typography text={description} variant='caption' /> : null}
      </View>
      {children}
    </View>
  );
};
