import { View } from 'react-native';
import * as C from '../../../components';
import { styles } from '../styles';
import type { AccountMachine, RequestType } from './types';

type Props = {
  visible: boolean;
  onClose: () => void;
  requestMachine: AccountMachine | undefined;
  requestType: RequestType;
  purchaseDate: string;
  onPurchaseDateChange: (value: string) => void;
  reason: string;
  onReasonChange: (value: string) => void;
  transactionId: string;
  onTransactionIdChange: (value: string) => void;
  summary: string;
  onSummaryChange: (value: string) => void;
  refundDetailsValid: boolean;
  onSubmit: () => void;
};

export const MachineRequestModal = ({
  visible,
  onClose,
  requestMachine,
  requestType,
  purchaseDate,
  onPurchaseDateChange,
  reason,
  onReasonChange,
  transactionId,
  onTransactionIdChange,
  summary,
  onSummaryChange,
  refundDetailsValid,
  onSubmit,
}: Props) => (
  <C.Modal visible={visible} onClose={onClose}>
    <View style={styles.modalContent}>
      <C.Typography text={requestType === 'Refund' ? 'Request a purchase refund' : `Request ${requestType.toLowerCase()}`} variant="title" />
      {requestMachine ? (
        <C.Typography
          text={`${requestMachine.machine.machine_id} · ${requestMachine.machine.model_code}`}
          variant="caption"
        />
      ) : null}
      {requestType === 'Refund' ? (
        <>
          <C.TextField
            label="Purchase date and time"
            value={purchaseDate}
            onChangeText={onPurchaseDateChange}
            placeholder="For example, 5 Nov 2026 at 10:30"
          />
          <C.TextField
            label="What happened?"
            value={reason}
            onChangeText={onReasonChange}
            placeholder="For example, payment taken but no product dispensed"
          />
          <C.TextField
            label="Transaction reference (optional)"
            value={transactionId}
            onChangeText={onTransactionIdChange}
            placeholder="Receipt or payment reference"
          />
        </>
      ) : null}
      <C.TextArea
        label={requestType === 'Refund' ? 'Additional details' : 'Describe the issue'}
        value={summary}
        onChangeText={onSummaryChange}
        placeholder="Add details that will help us review your request"
        style={styles.summaryInput}
        textAlignVertical="top"
      />
      <C.Typography
        text="Sample workflow only. This request is not transmitted or stored remotely."
        variant="caption"
      />
      <C.Buttons.Primary
        label={`Record ${requestType.toLowerCase()} request`}
        onPress={onSubmit}
        isDisabled={!summary.trim() || !refundDetailsValid}
      />
      <C.Buttons.Secondary label="Cancel" onPress={onClose} />
    </View>
  </C.Modal>
);
