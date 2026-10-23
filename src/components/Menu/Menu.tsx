import { useState } from 'react';
import { Buttons } from '../Buttons/Buttons';
import { Modal } from '../Modal/Modal';

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
      <Buttons.Secondary onPress={() => setVisible(true)} label={label} />

      <Modal
        visible={visible}
        onClose={() => setVisible(false)}
        canClose={canClose}
      >
        {items.map((item) => (
          <Buttons.Primary
            key={item.label}
            isDisabled={item.isDisabled}
            onPress={() => {
              item.onPress();
              setVisible(false);
            }}
            label={item.label}
          />
        ))}
      </Modal>
    </>
  );
};
