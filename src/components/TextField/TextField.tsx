import { Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { styles } from './style';

export type TextFieldProps = TextInputProps & {
  label?: string;
  helperText?: string;
  error?: string;
};

// Use for a labeled single-line input with optional help or validation text.
export const TextField = ({
  label,
  helperText,
  error,
  style,
  accessibilityLabel,
  ...props
}: TextFieldProps) => {
  return (
    <View style={styles.fieldGroup}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        {...props}
        accessibilityLabel={accessibilityLabel ?? label}
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
