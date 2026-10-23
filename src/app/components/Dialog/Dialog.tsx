import type { ComponentProps, ReactNode } from 'react';
import { Modal } from '../Modal/Modal';
import { Typography } from '../Typography/Typography';
type DialogProps = Omit<ComponentProps<typeof Modal>, 'children'> & {
  title: string;
  description?: string;
  children?: ReactNode;
};

export const Dialog = ({
  visible,
  onClose,
  animationType,
  presentationStyle,
  canClose,
  title,
  description,
  children,
}: DialogProps) => {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      animationType={animationType}
      presentationStyle={presentationStyle}
      canClose={canClose}
    >
      <Typography text={title} variant="title" />
      {description ? <Typography text={description} variant="caption" /> : null}
      {children}
    </Modal>
  );
};
