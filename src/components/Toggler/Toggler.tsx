import { Pressable, View } from 'react-native';
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
      <Pressable
        accessibilityRole="switch"
        accessibilityLabel={label}
        accessibilityState={{ checked: value, disabled: isDisabled }}
        aria-checked={value}
        aria-disabled={isDisabled}
        disabled={isDisabled}
        onPress={() => onValueChange(!value)}
      >
        <View style={[styles.track, value && styles.trackOn]}>
          <View style={[styles.thumb, value && styles.thumbOn]} />
        </View>
      </Pressable>
      {label ? <Typography text={label} variant='caption' /> : null}
    </View>
  );
};
