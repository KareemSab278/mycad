import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as C from '../../components';
import { fakeMachines, fakeServiceRequests } from '../../fakeAccountInfo';
import { useTheme } from '../../hooks/use-theme';
import type { ServiceRequest } from '../../types';

type RequestType = ServiceRequest['type'];

export const Machines = ({ onOpenSupport }: { onOpenSupport?: () => void }) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [activeMachineId, setActiveMachineId] = useState(fakeMachines[0].id);
  const [requestMachineId, setRequestMachineId] = useState(fakeMachines[0].id);
  const [requestType, setRequestType] = useState<RequestType>('Maintenance');
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requests, setRequests] = useState(fakeServiceRequests);
  const [summary, setSummary] = useState('');
  const [reason, setReason] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const activeMachine = fakeMachines.find((machine) => machine.id === activeMachineId) ?? fakeMachines[0];
  const requestMachine = fakeMachines.find((machine) => machine.id === requestMachineId) ?? fakeMachines[0];
  const machineRequests = requests.filter((request) => request.machineId === activeMachine.id);
  const refundDetailsValid = requestType !== 'Refund' || (reason.trim() !== '' && purchaseDate.trim() !== '');

  const openRequest = (type: RequestType, machineId: string) => {
    setRequestType(type);
    setRequestMachineId(machineId);
    setSummary('');
    setReason('');
    setPurchaseDate('');
    setTransactionId('');
    setRequestModalOpen(true);
  };

  const submitRequest = () => {
    const details = [
      requestType === 'Refund' ? reason.trim() : '',
      summary.trim(),
      purchaseDate.trim() ? `Purchase date: ${purchaseDate.trim()}` : '',
      transactionId.trim() ? `Transaction reference: ${transactionId.trim()}` : '',
    ].filter(Boolean).join('\n');

    if (!details || !refundDetailsValid) return;

    setRequests((current) => [{
      id: `SR-${Date.now()}`,
      machineId: requestMachineId,
      type: requestType,
      summary: details,
      status: 'In review',
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' }),
    }, ...current]);
    setRequestModalOpen(false);
  };

  return (
    <>
      <C.Tabs
        items={fakeMachines.map((machine) => ({ label: machine.name, value: machine.id }))}
        value={activeMachine.id}
        onValueChange={setActiveMachineId}
      />
      <C.Container contentContainerStyle={{
        paddingTop: insets.top + C.TABS_HEIGHT + C.TABS_TOP_GAP + 12,
      }}>
        <View style={styles.page}>
          <View style={styles.header}>
            <C.Typography text="Your machines" variant="heading" />
            <C.Typography text="Check machine status, deliveries, and recent service requests for all machines in your accounts." />
            {onOpenSupport ? (
              <C.Buttons.Secondary label="Support & billing" onPress={onOpenSupport} />
            ) : null}
          </View>

          <C.Card>
            <View style={styles.cardContent}>
              <View style={styles.machineHeading}>
                <View style={styles.headingText}>
                  <C.Typography text={activeMachine.name} variant="title" />
                  <C.Typography text={`${activeMachine.id} · ${activeMachine.model}`} variant="caption" />
                  <C.Typography text={activeMachine.account} variant="caption" />
                </View>
                <C.Typography
                  text={
                    (activeMachine.status === 'Last serviced' || activeMachine.status === 'Online') ?
                      `Last serviced: ${activeMachine.lastServiced}` : activeMachine.status
                  }
                  variant="caption"
                />
              </View>

              <View style={styles.details}>
                {[
                  ['Account arrangement', activeMachine.arrangement],
                  ['Next delivery', activeMachine.nextDelivery],
                  ['Last serviced', activeMachine.lastServiced],
                ].map(([label, value]) => (
                  <View key={label} style={styles.detail}>
                    <C.Typography text={label} variant="caption" />
                    <C.Typography text={value} variant="body" />
                  </View>
                ))}
              </View>

              <View style={styles.actionStack}>
                <C.Buttons.Primary
                  label="Request maintenance"
                  onPress={() => openRequest('Maintenance', activeMachine.id)}
                />
                <C.Buttons.Secondary
                  label="Ask for support"
                  onPress={() => openRequest('Support', activeMachine.id)}
                />
                <C.Buttons.Secondary
                  label="Request refund"
                  onPress={() => openRequest('Refund', activeMachine.id)}
                />
              </View>
            </View>
          </C.Card>

          <C.Card>
            <View style={styles.cardContent}>
              <View style={styles.sectionHeading}>
                <View style={styles.headingText}>
                  <C.Typography text="Service & purchase requests" variant="title" />
                  <C.Typography text={`Recent activity for ${activeMachine.id}`} variant="caption" />
                </View>
                <C.Typography text={`${machineRequests.length} requests`} variant="caption" />
              </View>

              {machineRequests.length ? machineRequests.map((request) => (
                <View key={request.id} style={[styles.requestRow, { borderColor: theme.border }]}>
                  <View style={styles.headingText}>
                    <C.Typography text={request.summary} variant="body" />
                    <C.Typography text={`${request.id} · ${request.type} · ${request.date}`} variant="caption" />
                  </View>
                  <C.Typography text={request.status} variant="caption" />
                </View>
              )) : (
                <C.Typography text="No requests for this machine yet." variant="caption" />
              )}
            </View>
          </C.Card>
        </View>
      </C.Container>

      <C.Modal visible={requestModalOpen} onClose={() => setRequestModalOpen(false)}>
        <View style={styles.modalContent}>
          <C.Typography text={requestType === 'Refund' ? 'Request a purchase refund' : `Request ${requestType.toLowerCase()}`} variant="title" />
          <C.Typography text={`${requestMachine.id} · ${requestMachine.name}`} variant="caption" />
          {requestType === 'Refund' ? (
            <>
              <C.TextField
                label="Purchase date and time"
                value={purchaseDate}
                onChangeText={setPurchaseDate}
                placeholder="For example, 5 Nov 2026 at 10:30"
              />
              <C.TextField
                label="What happened?"
                value={reason}
                onChangeText={setReason}
                placeholder="For example, payment taken but no product dispensed"
              />
              <C.TextField
                label="Transaction reference (optional)"
                value={transactionId}
                onChangeText={setTransactionId}
                placeholder="Receipt or payment reference"
              />
            </>
          ) : null}
          <C.TextArea
            label={requestType === 'Refund' ? 'Additional details' : 'Describe the issue'}
            value={summary}
            onChangeText={setSummary}
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
            onPress={submitRequest}
            isDisabled={!summary.trim() || !refundDetailsValid}
          />
          <C.Buttons.Secondary label="Cancel" onPress={() => setRequestModalOpen(false)} />
        </View>
      </C.Modal>
    </>
  );
};

const styles = StyleSheet.create({
  page: {
    gap: 16,
    paddingBottom: 24,
  },
  header: {
    gap: 8,
  },
  cardContent: {
    gap: 12,
  },
  machineHeading: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  headingText: {
    flex: 1,
    gap: 4,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detail: {
    flexGrow: 1,
    minWidth: '40%',
  },
  actionStack: {
    gap: 8,
  },
  sectionHeading: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  requestRow: {
    borderTopWidth: 1,
    gap: 8,
    paddingTop: 12,
  },
  modalContent: {
    gap: 12,
  },
  summaryInput: {
    minHeight: 100,
  },
});
