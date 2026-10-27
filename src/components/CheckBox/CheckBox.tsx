import { Pressable, View } from 'react-native';
import { Typography } from '../Typography/Typography';
import { styles } from './style';
type CheckBoxProps = {
  checked: boolean;
  onValueChange: (checked: boolean) => void;
  label?: string;
  isDisabled?: boolean;
};

export const CheckBox = ({
  checked,
  onValueChange,
  label,
  isDisabled = false,
}: CheckBoxProps) => {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked, disabled: isDisabled }}
      aria-checked={checked}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      onPress={() => onValueChange(!checked)}
      style={styles.row}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? <Typography text="✓" variant='caption' /> : null}
      </View>
      {label ? <Typography text={label} variant='caption' /> : null}
    </Pressable>
  );
};
