import type { TextInputProps } from 'react-native';
import { TextInput, View } from 'react-native';
import { styles } from './style';

import { Search } from 'lucide-react-native';
import { useTheme } from '../../hooks/use-theme';
// Use to filter a list or collection of results.

// Use to filter a list or collection of results.
export const SearchField = ({
  style,
  placeholder = 'Search',
  ...props
}: TextInputProps) => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Search
        size={15}
        color={theme.text}
        strokeWidth={3}
      />

      <TextInput
        {...props}
        placeholder={placeholder}
        placeholderTextColor={props.placeholderTextColor ?? theme.textSecondary}
        accessibilityLabel={props.accessibilityLabel ?? placeholder}
        returnKeyType={props.returnKeyType ?? 'search'}
        style={[styles.input, { color: theme.text }, style]}
      />
    </View>
  );
};