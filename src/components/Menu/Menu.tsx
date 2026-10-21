import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from '../Buttons/Buttons';
import { Modal } from '../Modal/Modal';
import { PressableFeedback } from '../PressableFeedback/PressableFeedback';
import { styles } from './style';

export type MenuItem = {
  label: string;
  onPress: () => void;
  isDisabled?: boolean;
};

// Use for a compact list of contextual actions.
export const Menu = ({
  items,
  label = 'Menu',
}: {
  items: readonly MenuItem[];
  label?: string;
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button style={styles.trigger} variant="secondary" onPress={() => setVisible(true)}>
        {label}
      </Button>
      <Modal visible={visible} onRequestClose={() => setVisible(false)}>
        <View style={styles.list}>
          {items.map((item) => (
            <PressableFeedback
              key={item.label}
              accessibilityRole="button"
              isDisabled={item.isDisabled}
              onPress={() => {
                item.onPress();
                setVisible(false);
              }}
              style={styles.listItem}
            >
              <Text>{item.label}</Text>
            </PressableFeedback>
          ))}
        </View>
      </Modal>
    </>
  );
};
