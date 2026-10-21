import { Modal as NativeModal, View } from 'react-native';
import type { ModalProps as NativeModalProps } from 'react-native';
import type { ReactNode } from 'react';
import { styles } from './style';

export type ModalProps = Pick<NativeModalProps, 'animationType' | 'presentationStyle'> & {
  visible: boolean;
  onRequestClose: NonNullable<NativeModalProps['onRequestClose']>;
  children: ReactNode;
};

// Use as the reusable overlay and centered content surface for modal flows.
export const Modal = ({
  visible,
  onRequestClose,
  animationType = 'fade',
  presentationStyle = 'overFullScreen',
  children,
}: ModalProps) => {
  return (
    <NativeModal
      visible={visible}
      transparent
      animationType={animationType}
      presentationStyle={presentationStyle}
      onRequestClose={onRequestClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.content}>{children}</View>
      </View>
    </NativeModal>
  );
};
