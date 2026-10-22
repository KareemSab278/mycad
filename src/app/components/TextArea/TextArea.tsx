import { Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { styles } from './style';

export type TextAreaProps = TextInputProps & {
  label?: string;
  helperText?: string;
  error?: string;
};

// Use for multiline user-entered text.
export const TextArea = ({
  label,
  helperText,
  error,
  style,
  accessibilityLabel,
  ...props
}: TextAreaProps) => {
  return (
    <View style={styles.fieldGroup}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        {...props}
        accessibilityLabel={accessibilityLabel ?? label}
        multiline
        style={[styles.input, style]}
      />
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helper}>{helperText}</Text>
      ) : null}
    </View>
  );
};
