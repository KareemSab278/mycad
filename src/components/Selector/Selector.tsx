import { useState } from 'react';
import { Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { Modal } from '../Modal/Modal';
import { Typography } from '../Typography/Typography';
import { styles } from './style';

export type SelectorOption = {
  label: string;
  value: string;
};

type SelectorProps = {
  label?: string;
  placeholder?: string;
  options: readonly SelectorOption[];
  value?: string;
  onValueChange: (value: string) => void;
};

// Use to choose one item, such as a country, from a scrollable list.
export const Selector = ({
  label,
  placeholder = 'Select an option',
  options,
  value,
  onValueChange,
}: SelectorProps) => {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  const { height } = useWindowDimensions();
  const selectedOption = options.find((option) => option.value === value);

  return (
    <View style={styles.fieldGroup}>
      {label ? <Typography text={label} style={styles.label} /> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label ?? placeholder}: ${selectedOption?.label ?? placeholder}`}
        accessibilityState={{ expanded: visible }}
        aria-expanded={visible}
        onPress={() => setVisible(true)}
        style={[
          styles.trigger,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.border,
          },
        ]}
      >
        <Typography text={selectedOption?.label ?? placeholder} style={{ ...styles.triggerText, color: selectedOption ? theme.text : theme.textSecondary }} />
        <Typography text="⌄" style={{ ...styles.chevron, color: theme.textSecondary }} />
      </Pressable>
      <Modal visible={visible} onClose={() => setVisible(false)}>
        <ScrollView style={[styles.list, { maxHeight: Math.max(0, Math.min(400, (height - 48) * 0.85 - 40)) }]} keyboardShouldPersistTaps="handled">
          {options.map((option) => (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected: option.value === value }}
              onPress={() => {
                onValueChange(option.value);
                setVisible(false);
              }}
              style={[
                styles.listItem,
                option.value === value && { backgroundColor: theme.backgroundSelected },
              ]}
            >
              <Typography text={option.label} style={styles.optionText} />
            </Pressable>
          ))}
        </ScrollView>
      </Modal>
    </View>
  );
};
