import { useState } from 'react';
import { Pressable, View } from 'react-native';
import * as C from '../../../components';
import { useTheme } from '../../../hooks/use-theme';
import { styles } from '../styles';
import type { AccountMachine, RequestType } from './types';

type Props = {
  visible: boolean;
  onClose: () => void;
  requestMachine: AccountMachine | undefined;
  requestType: RequestType;
  purchaseDate: Date | null;
  onPurchaseDateChange: (value: Date) => void;
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
}: Props) => {
  const theme = useTheme();
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const dateLabel = purchaseDate
    ? purchaseDate.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
    : 'Select purchase date and time';

  return (
    <>
      <C.Modal
        visible={visible && !datePickerVisible}
        onClose={() => {
          setDatePickerVisible(false);
          onClose();
        }}
      >
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
              <View style={styles.dateField}>
                <C.Typography text="Purchase date and time" variant="caption" />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={dateLabel}
                  onPress={() => setDatePickerVisible(true)}
                  style={[
                    styles.datePickerButton,
                    { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                  ]}
                >
                  <C.Typography text={dateLabel} />
                </Pressable>
              </View>
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
      <C.Modal
        visible={visible && datePickerVisible}
        onClose={() => setDatePickerVisible(false)}
      >
        <View style={styles.modalContent}>
          <C.Typography text="Select purchase date and time" variant="title" />
          <C.Calendar
            key={purchaseDate ? `${purchaseDate.getFullYear()}-${purchaseDate.getMonth()}` : 'unselected'}
            value={purchaseDate ?? undefined}
            onChange={onPurchaseDateChange}
            showTime
          />
          <C.Buttons.Primary
            label="Use date and time"
            onPress={() => setDatePickerVisible(false)}
            isDisabled={!purchaseDate}
          />
          <C.Buttons.Secondary label="Cancel" onPress={() => setDatePickerVisible(false)} />
        </View>
      </C.Modal>
    </>
  );
};
