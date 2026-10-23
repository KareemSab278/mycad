import type { TextInputProps } from 'react-native';
import { TextInput, View } from 'react-native';
import { Typography } from '../Typography/Typography';
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
      {label ? <Typography text={label} variant='body' /> : null}
      <TextInput
        {...props}
        accessibilityLabel={accessibilityLabel ?? label}
        style={[styles.input, style]}
      />
      {error ? (
        <Typography text={error} variant='body' />
      ) : helperText ? (
        <Typography text={helperText} variant='body' />
      ) : null}
    </View>
  );
};
