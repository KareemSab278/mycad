import { View } from 'react-native';
import { Typography } from '../../../components/Typography/Typography';
import { styles } from './styles';

export const Home = () => {
  return (
    <View style={styles.panel}>
      <Typography text="Home" variant="title" />
      <Typography text="This is a simple placeholder screen." variant="body" />
    </View>
  );
};
