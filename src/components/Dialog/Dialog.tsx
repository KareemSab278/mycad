import type { ComponentProps, ReactNode } from 'react';
import { Text } from 'react-native';
import { Modal } from '../Modal/Modal';
import { styles } from './style';

type DialogProps = Omit<ComponentProps<typeof Modal>, 'children'> & {
  title: string;
  description?: string;
  children?: ReactNode;
};

export const Dialog = ({
  visible,
  onRequestClose,
  animationType,
  presentationStyle,
  title,
  description,
  children,
}: DialogProps) => {
  return (
    <Modal
      visible={visible}
      onRequestClose={onRequestClose}
      animationType={animationType}
      presentationStyle={presentationStyle}
    >
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {children}
    </Modal>
  );
};
