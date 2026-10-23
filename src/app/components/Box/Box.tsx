import type { ReactNode } from 'react';
import { View } from 'react-native';
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
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <Typography text={title} variant='title' />
        {description ? <Typography text={description} variant='caption' /> : null}
      </View>
      {children}
    </View>
  );
};
