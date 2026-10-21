import type { ReactNode } from 'react';
import type { ModalProps as NativeModalProps } from 'react-native';
import { Modal as NativeModal, Pressable, View } from 'react-native';
import { styles } from './style';

export type ModalProps = Pick<NativeModalProps, 'animationType' | 'presentationStyle'> & {
  visible: boolean;
  onClose: NonNullable<NativeModalProps['onRequestClose']>;
  children: ReactNode;
  canClose?: boolean;
};

// Use as the reusable overlay and centered content surface for modal flows.
export const Modal = ({
  visible,
  onClose,
  animationType = 'fade',
  presentationStyle = 'overFullScreen',
  children,
  canClose = true,
}: ModalProps) => {

  return (
    <NativeModal
      visible={visible}
      transparent
      animationType={animationType}
      presentationStyle={presentationStyle}
      onRequestClose={canClose ? onClose : undefined}
    >
      <View style={styles.backdrop}>
        {canClose && (
          <Pressable
            accessibilityLabel="Close modal"
            accessibilityRole="button"
            onPress={onClose}
            style={styles.backdropPressable}
          />
        )}
        <View style={styles.content}>{children}</View>
      </View>
    </NativeModal>
  );
};
