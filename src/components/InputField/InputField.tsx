import { View } from 'react-native';
import type { TextFieldProps } from '../TextField/TextField';
import { TextField } from '../TextField/TextField';
import { styles } from './style';

export const InputField = (props: TextFieldProps) => {
  return (
    <View style={styles.container}>
      <TextField {...props} />
    </View>
  );
};
