import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as C from '../../components';
import { fakeServiceRequests } from '../../fakeAccountInfo';
import { useNav } from '../../helpers/navigation';
import { useTheme } from '../../hooks/use-theme';
import * as Ls from '../../storage';
import type { Machine, ServiceRequest } from '../../types';

type RequestType = ServiceRequest['type'];
type AccountMachine = {
  machine: Machine;
  accountName: string;
  siteName: string;
};

const getMachineKey = ({ machine, accountName, siteName }: AccountMachine) =>
  machine.id ?? `${accountName}:${siteName}:${machine.name}`;

export const Machines = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const nav = useNav();
  const { machine_id: routeMachineId } = useLocalSearchParams<{ machine_id?: string | string[] }>();
  const [machines, setMachines] = useState<AccountMachine[]>([]);
  const [activeMachineId, setActiveMachineId] = useState('');
  const [requestMachineId, setRequestMachineId] = useState('');
  const [requestType, setRequestType] = useState<RequestType>('Maintenance');
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requests, setRequests] = useState(fakeServiceRequests);
  const [summary, setSummary] = useState('');
  const [reason, setReason] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [accountError, setAccountError] = useState('');

  useEffect(() => {
    let active = true;

    const loadMachines = async () => {
      try {
        const account = await Ls.Creds.get();
        if (!account) {
          if (active) setAccountError('No signed-in account was found.');
          return;
        }

        const accountMachines = account.business_accounts.flatMap((businessAccount) =>
          businessAccount.sites.flatMap((site) =>
            site.machines.map((machine) => ({
              machine,
              accountName: businessAccount.name,
              siteName: site.name,
            })),
          ),
        );

        if (active) {
          setMachines(accountMachines);
          const requestedId = Array.isArray(routeMachineId) ? routeMachineId[0] : routeMachineId;
          const requestedMachine = accountMachines.find((entry) =>
            entry.machine.id === requestedId || entry.machine.name === requestedId,
          ) ?? accountMachines[0];
          const requestedMachineKey = requestedMachine ? getMachineKey(requestedMachine) : '';
          setActiveMachineId(requestedMachineKey);
          setRequestMachineId(requestedMachineKey);
        }
      } catch (error) {
        console.error('Unable to load machine account data:', error);
        if (active) setAccountError('Unable to load your machines. Please try again later.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadMachines();
    return () => {
      active = false;
    };
  }, [routeMachineId]);

  const activeMachine = machines.find((entry) => getMachineKey(entry) === activeMachineId) ?? machines[0];
  const requestMachine = machines.find((entry) => getMachineKey(entry) === requestMachineId) ?? activeMachine;
  const machineId = activeMachine?.machine.id ?? activeMachine?.machine.name;
  const machineRequests = requests.filter((request) => request.machineId === machineId);
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

    if (!details || !refundDetailsValid || !requestMachine) return;

    setRequests((current) => [{
      id: `SR-${Date.now()}`,
      machineId: requestMachine.machine.id ?? requestMachine.machine.name,
      type: requestType,
      summary: details,
      status: 'In review',
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' }),
    }, ...current]);
    setRequestModalOpen(false);
  };

  if (loading) return <C.Loader />;

  return (
    <>
      {machines.length > 1 ? (
        <C.Tabs
          items={machines.map((entry) => ({
            label: entry.machine.name,
            value: getMachineKey(entry),
          }))}
          value={activeMachineId}
          onValueChange={setActiveMachineId}
        />
      ) : null}
      <C.Container contentContainerStyle={{
        paddingTop: insets.top + (machines.length > 1 ? C.TABS_HEIGHT + C.TABS_TOP_GAP + 12 : 12),
      }}>
        <View style={styles.page}>
          <View style={styles.header}>
            <C.Typography text="Your machines" variant="heading" />
            {routeMachineId ? (
              <C.Buttons.Primary label="Back to Home" onPress={nav.back} />
            ) : null}
            <C.Typography text="Check machine status, deliveries, and recent service requests for all machines in your accounts." />
          </View>

          {accountError ? (
            <C.Alert tone="error" title="Machines unavailable" message={accountError} />
          ) : !activeMachine ? (
            <C.Typography text="No machines are available for this account." variant="caption" />
          ) : (
            <>
          <C.Card>
            <View style={styles.cardContent}>
              <View style={styles.machineHeading}>
                <View style={styles.headingText}>
                  <C.Typography text={activeMachine.machine.name} variant="title" />
                  {activeMachine.machine.id ? (
                    <C.Typography text={`Machine ID: ${activeMachine.machine.id}`} variant="caption" />
                  ) : null}
                  {activeMachine.machine.model ? (
                    <C.Typography text={activeMachine.machine.model} variant="caption" />
                  ) : null}
                  <C.Typography text={`${activeMachine.accountName} · ${activeMachine.siteName}`} variant="caption" />
                </View>
                {activeMachine.machine.status ? (
                  <C.Typography text={activeMachine.machine.status} variant="caption" />
                ) : null}
              </View>

              <View style={styles.details}>
                {[
                  ['Account arrangement', activeMachine.machine.arrangement],
                  ['Next delivery', activeMachine.machine.nextDelivery],
                  ['Last serviced', activeMachine.machine.lastServiced],
                ].filter((item): item is [string, string] => Boolean(item[1])).map(([label, value]) => (
                  <View key={label} style={styles.detail}>
                    <C.Typography text={label} variant="caption" />
                    <C.Typography text={value} variant="body" />
                  </View>
                ))}
              </View>

              <View style={styles.actionStack}>
                <C.Buttons.Primary
                  label="Request maintenance"
                  onPress={() => openRequest('Maintenance', getMachineKey(activeMachine))}
                />
                <C.Buttons.Secondary
                  label="Ask for support"
                  onPress={() => openRequest('Support', getMachineKey(activeMachine))}
                />
                <C.Buttons.Secondary
                  label="Request refund"
                  onPress={() => openRequest('Refund', getMachineKey(activeMachine))}
                />
              </View>
            </View>
          </C.Card>

          <C.Card>
            <View style={styles.cardContent}>
              <View style={styles.sectionHeading}>
                <View style={styles.headingText}>
                  <C.Typography text="Service & purchase requests" variant="title" />
                  <C.Typography text={`Recent activity for ${machineId}`} variant="caption" />
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
            </>
          )}
        </View>
      </C.Container>

      <C.Modal visible={requestModalOpen && Boolean(requestMachine)} onClose={() => setRequestModalOpen(false)}>
        <View style={styles.modalContent}>
          <C.Typography text={requestType === 'Refund' ? 'Request a purchase refund' : `Request ${requestType.toLowerCase()}`} variant="title" />
          {requestMachine ? (
            <C.Typography
              text={`${requestMachine.machine.id ?? requestMachine.machine.name} · ${requestMachine.machine.name}`}
              variant="caption"
            />
          ) : null}
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
