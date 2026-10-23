import { Typography } from '@/components';
import { View } from 'react-native';
import { styles } from './styles';

export const Account = () => {
  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <Typography text="Account" variant="title" />
        <Typography text="This is a simple placeholder screen." variant="body" />
      </View>
    </View>
  );
};
