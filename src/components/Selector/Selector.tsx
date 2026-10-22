import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Modal } from '../Modal/Modal';
import { PressableFeedback } from '../PressableFeedback/PressableFeedback';
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
  const selectedOption = options.find((option) => option.value === value);

  return (
    <View style={styles.fieldGroup}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <PressableFeedback
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholder}
        onPress={() => setVisible(true)}
        style={styles.trigger}
      >
        <Text style={styles.triggerText}>{selectedOption?.label ?? placeholder}</Text>
      </PressableFeedback>
      <Modal visible={visible} onClose={() => setVisible(false)}>
        <ScrollView style={styles.list}>
          {options.map((option) => (
            <PressableFeedback
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected: option.value === value }}
              onPress={() => {
                onValueChange(option.value);
                setVisible(false);
              }}
              style={[
                styles.listItem,
                option.value === value && styles.listItemSelected,
              ]}
            >
              <Text>{option.label}</Text>
            </PressableFeedback>
          ))}
        </ScrollView>
      </Modal>
    </View>
  );
};
