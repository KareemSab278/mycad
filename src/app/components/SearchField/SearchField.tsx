import type { TextInputProps } from 'react-native';
import { TextInput, View } from 'react-native';
import { Typography } from '../Typography/Typography';
import { styles } from './style';

// Use to filter a list or collection of results.
export const SearchField = ({
  style,
  placeholder = 'Search',
  ...props
}: TextInputProps) => {
  return (
    <View style={styles.container}>
      <Typography text="⌕" variant="body" />
      <TextInput
        {...props}
        placeholder={placeholder}
        accessibilityLabel={props.accessibilityLabel ?? placeholder}
        returnKeyType={props.returnKeyType ?? 'search'}
        style={[styles.input, style]}
      />
    </View>
  );
};
