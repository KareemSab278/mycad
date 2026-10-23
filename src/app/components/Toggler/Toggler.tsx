import { View } from 'react-native';
import { PressableFeedback } from '../PressableFeedback/PressableFeedback';
import { Typography } from '../Typography/Typography';
import { styles } from './style';

type TogglerProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  isDisabled?: boolean;
};

// Use as an accessible on/off setting control.
export const Toggler = ({
  value,
  onValueChange,
  label,
  isDisabled = false,
}: TogglerProps) => {
  return (
    <View style={styles.row}>
      <PressableFeedback
        accessibilityRole="switch"
        accessibilityState={{ checked: value, disabled: isDisabled }}
        isDisabled={isDisabled}
        onPress={() => onValueChange(!value)}
      >
        <View style={[styles.track, value && styles.trackOn]}>
          <View style={[styles.thumb, value && styles.thumbOn]} />
        </View>
      </PressableFeedback>
      {label ? <Typography text={label} variant='caption' /> : null}
    </View>
  );
};
