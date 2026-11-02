import type { ReactNode } from 'react';
import type { ModalProps as NativeModalProps, StyleProp, ViewStyle } from 'react-native';
import { KeyboardAvoidingView, Modal as NativeModal, Platform, Pressable, View } from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { styles } from './style';

export type ModalProps = Pick<NativeModalProps, 'animationType' | 'presentationStyle'> & {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  canClose?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

// Use as the reusable overlay and centered content surface for modal flows.
export const Modal = ({
  visible,
  onClose,
  animationType = 'fade',
  presentationStyle = 'overFullScreen',
  children,
  canClose = true,
  contentStyle,
}: ModalProps) => {
  const theme = useTheme();

  return (
    <NativeModal
      visible={visible}
      transparent
      animationType={animationType}
      presentationStyle={presentationStyle}
      onRequestClose={canClose ? () => onClose() : undefined}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.backdrop, { backgroundColor: theme.overlay }]}>
          {canClose && (
            // the backdrop pressable allows closing the modal when tapping outside the content.
            <Pressable
              accessibilityLabel="Close modal"
              accessibilityRole="button"
              onPress={() => onClose()}
              style={styles.backdropPressable}
            />
          )}
          <View
            style={[
              styles.content,
              { backgroundColor: theme.backgroundElement, borderColor: theme.border },
              contentStyle,
            ]}
          >
            {children}
          </View>
        </View>
      </KeyboardAvoidingView>
    </NativeModal>
  );
};
