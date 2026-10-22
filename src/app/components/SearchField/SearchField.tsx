import { Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { styles } from './style';

// Use to filter a list or collection of results.
export const SearchField = ({
  style,
  placeholder = 'Search',
  ...props
}: TextInputProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon} accessibilityElementsHidden>
        ⌕
      </Text>
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
