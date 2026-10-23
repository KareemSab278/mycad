import type { TextInputProps } from 'react-native';
import { TextInput, View } from 'react-native';
import { Typography } from '../Typography/Typography';
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
      {label ? <Typography text={label} variant='body' /> : null}
      <TextInput
        {...props}
        accessibilityLabel={accessibilityLabel ?? label}
        multiline
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
