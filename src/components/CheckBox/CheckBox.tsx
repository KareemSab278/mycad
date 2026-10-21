import { Text, View } from 'react-native';
import { PressableFeedback } from '../PressableFeedback/PressableFeedback';
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
    <PressableFeedback
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled: isDisabled }}
      isDisabled={isDisabled}
      onPress={() => onValueChange(!checked)}
      style={styles.row}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? <Text style={styles.mark}>✓</Text> : null}
      </View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </PressableFeedback>
  );
};
