import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as C from '../../components';
import { fakeServiceRequests } from '../../fakeData';
import { useNav } from '../../helpers/navigation';
import { useTheme } from '../../hooks/use-theme';
import * as Ls from '../../storage';
import {
  getMachineKey,
  MachineDetailsCard,
  MachineRequestModal,
  ServiceRequestsCard,
} from './Components';
import type { AccountMachine, RequestType } from './Components';
import { styles } from './styles';

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
              <MachineDetailsCard
                entry={activeMachine}
                onRequest={openRequest}
              />
              <ServiceRequestsCard
                machineId={machineId}
                requests={machineRequests}
                borderColor={theme.border}
              />
            </>
          )}
        </View>
      </C.Container>

      <MachineRequestModal
        visible={requestModalOpen && Boolean(requestMachine)}
        onClose={() => setRequestModalOpen(false)}
        requestMachine={requestMachine}
        requestType={requestType}
        purchaseDate={purchaseDate}
        onPurchaseDateChange={setPurchaseDate}
        reason={reason}
        onReasonChange={setReason}
        transactionId={transactionId}
        onTransactionIdChange={setTransactionId}
        summary={summary}
        onSummaryChange={setSummary}
        refundDetailsValid={refundDetailsValid}
        onSubmit={submitRequest}
      />
    </>
  );
};
