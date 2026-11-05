import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import * as C from '../../../components';
import { styles } from '../styles';
import type { ContactDetails } from './types';

type Props = {
  visible: boolean;
  onClose: () => void;
  contact: ContactDetails | null;
  loadingAccount: boolean;
  accountError: string;
  machineId: string;
  onMachineIdChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
};

export const SupportRequestModal = ({
  visible,
  onClose,
  contact,
  loadingAccount,
  accountError,
  machineId,
  onMachineIdChange,
  description,
  onDescriptionChange,
  onSubmit,
}: Props) => (
  <C.Modal visible={visible} onClose={onClose}>
    <KeyboardAwareScrollView
      bottomOffset={24}
      keyboardShouldPersistTaps="handled"
      mode="layout"
      style={styles.modalScroll}
      contentContainerStyle={styles.modalContent}
    >
      <C.Typography text="Ask for help" variant="title" />
      <C.Typography
        text={contact ? `Your signed-in email and account (${contact.accountName}) are attached automatically.` : 'Error: No account information available.'}
        variant="caption"
      />
      {accountError ? (
        <C.Alert tone="error" title="Account unavailable" message={accountError} />
      ) : null}
      <C.TextField
        label="Machine ID (optional)"
        value={machineId}
        onChangeText={onMachineIdChange}
        placeholder="Enter the machine ID if relevant"
        autoCapitalize="characters"
      />
      <C.TextArea
        label="Describe the issue"
        value={description}
        onChangeText={onDescriptionChange}
        placeholder="How can we help?"
        textAlignVertical="top"
      />
      <C.Buttons.Primary
        label="Record support request"
        onPress={onSubmit}
        isDisabled={loadingAccount || !contact || !description.trim()}
      />
      <C.Buttons.Secondary label="Cancel" onPress={onClose} />
    </KeyboardAwareScrollView>
  </C.Modal>
);
