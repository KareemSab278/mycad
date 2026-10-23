import type { ReactNode } from 'react';
import type { ModalProps as NativeModalProps } from 'react-native';
import { Modal as NativeModal, Pressable, View } from 'react-native';
import { useTheme } from '../../hooks/use-theme';
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
  const theme = useTheme();

  return (
    <NativeModal
      visible={visible}
      transparent
      animationType={animationType}
      presentationStyle={presentationStyle}
      onRequestClose={canClose ? onClose : undefined}
    >
      <View
        style={[styles.backdrop, { backgroundColor: theme.overlay }]}
      >
        {canClose && (
          // the backdrop pressable allows closing the modal when tapping outside the content.
          <Pressable
            accessibilityLabel="Close modal"
            accessibilityRole="button"
            onPress={onClose}
            style={styles.backdropPressable}
          />
        )}
        <View style={[styles.content, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          {children}
        </View>
      </View>
    </NativeModal>
  );
};
