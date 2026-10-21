import { useState } from 'react';
import { View } from 'react-native';
import { Buttons } from '../Buttons/Buttons';
import { Modal } from '../Modal/Modal';
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
  canClose = true,
}: {
  items: readonly MenuItem[];
  label?: string;
  canClose?: boolean;
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Buttons.Secondary onPress={() => setVisible(true)} label={label}/>

      <Modal
        visible={visible}
        onClose={() => setVisible(false)}
        canClose={canClose}
      >
        <View style={styles.list}>
          {items.map((item) => (
            <Buttons.Secondary
              key={item.label}
              isDisabled={item.isDisabled}
              onPress={() => {
                item.onPress();
                setVisible(false);
              }}
              label={item.label}
            />
          ))}
        </View>
      </Modal>
    </>
  );
};
