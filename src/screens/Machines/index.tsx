import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Account, Machine } from '../../api';
import * as C from '../../components';
import { useNav } from '../../helpers/navigation';
import { useTheme } from '../../hooks/use-theme';
import type { ServiceRequest } from '../../types';
import type { AccountMachine, RequestType } from './Components';
import { getMachineKey, MachineDetailsCard, MachineGrid, MachineRequestModal, ServiceRequestsCard } from './Components';
import { styles } from './styles';

export const Machines = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const nav = useNav();
  const {
    account_id: routeAccountId,
    machine_id: routeMachineId,
  } = useLocalSearchParams<{ account_id?: string | string[]; machine_id?: string | string[] }>();
  const [machines, setMachines] = useState<AccountMachine[]>([]);
  const [activeMachineId, setActiveMachineId] = useState('');
  const [requestMachineId, setRequestMachineId] = useState('');
  const [requestType, setRequestType] = useState<RequestType>('Maintenance');
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
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
        const accounts = await Account.GetAll();
        const requestedAccountId = Array.isArray(routeAccountId) ? routeAccountId[0] : routeAccountId;
        const matchingAccounts = requestedAccountId
          ? accounts.filter((account) => account.account_id === requestedAccountId)
          : accounts;
        const accountMachines = await Machine.GetAllForAccounts(matchingAccounts);

        if (active) {
          setMachines(accountMachines);
          const requestedId = Array.isArray(routeMachineId) ? routeMachineId[0] : routeMachineId;
          const requestedMachine = accountMachines.find((entry) =>
            entry.machine.machine_id === requestedId,
          ) ?? accountMachines[0];
          const requestedMachineKey = requestedMachine ? getMachineKey(requestedMachine) : '';
          setActiveMachineId(requestedMachineKey);
          setRequestMachineId(requestedMachineKey);
        }
      } catch (error) {
        console.error('Unable to load installed machine data:', error);
        if (active) setAccountError('Unable to load your machines. Please try again later.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadMachines();
    return () => {
      active = false;
    };
  }, [routeAccountId, routeMachineId]);

  const activeMachine = machines.find((entry) => getMachineKey(entry) === activeMachineId) ?? machines[0];
  const requestMachine = machines.find((entry) => getMachineKey(entry) === requestMachineId) ?? activeMachine;
  const machineKey = activeMachine ? getMachineKey(activeMachine) : undefined;
  const machineRequests = requests.filter((request) => request.machineId === machineKey);
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
      machineId: getMachineKey(requestMachine),
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
      <C.Container contentContainerStyle={{
        paddingTop: insets.top + 12,
      }}>
        <View style={styles.page}>
          <View style={styles.header}>
            <C.Typography text="Your machines" variant="heading" />
            {routeMachineId ? (
              <C.Buttons.Primary label="Back to Home" onPress={nav.back} />
            ) : null}
            <C.Typography text="Installed machines linked to your accounts." />
          </View>

          {accountError ? (
            <C.Alert tone="error" title="Machines unavailable" message={accountError} />
          ) : machines.length === 0 ? (
            <C.Typography text="No installed machines are available for this account." variant="caption" />
          ) : (
            <>

              {activeMachine ? (
                <>
                  <ServiceRequestsCard
                    machineId={activeMachine.machine.machine_id}
                    requests={machineRequests}
                    borderColor={theme.border}
                  />
                  <MachineDetailsCard
                    entry={activeMachine}
                    onRequest={openRequest}
                  />

                </>
              ) : null}

              <MachineGrid
                machines={machines}
                selectedMachineKey={machineKey}
                onMachinePress={(entry) => setActiveMachineId(getMachineKey(entry))}
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
