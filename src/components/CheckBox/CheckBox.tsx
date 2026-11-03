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
  const labelStyle = !checked ? { color: '#8a8c8d', marginTop: 10 } : { marginTop: 10 };
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
        {checked && <Typography text="" />}
      </View>
      {label && <Typography text={label} style={labelStyle} />}
    </Pressable>
  );
};
