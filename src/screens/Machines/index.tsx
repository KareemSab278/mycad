import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Account, Machine } from '../../api';
import * as C from '../../components';
import { useTheme } from '../../hooks/use-theme';
import type { ServiceRequest } from '../../types';
import type { AccountMachine, RequestType } from './Components';
import { getMachineKey, MachineDetailsCard, MachineGrid, MachineRequestModal, ServiceRequestsCard } from './Components';
import { styles } from './styles';

type MachineSelection = {
  accountId: string;
  machineId: string;
};

type MachinesProps = {
  machineSelection?: MachineSelection | null;
};

export const Machines = ({ machineSelection }: MachinesProps) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const {
    account_id: routeAccountId,
    machine_id: routeMachineId,
  } = useLocalSearchParams<{ account_id?: string | string[]; machine_id?: string | string[] }>();
  const requestedAccountId = machineSelection?.accountId
    ?? (Array.isArray(routeAccountId) ? routeAccountId[0] : routeAccountId);
  const requestedMachineId = machineSelection?.machineId
    ?? (Array.isArray(routeMachineId) ? routeMachineId[0] : routeMachineId);
  const [machines, setMachines] = useState<AccountMachine[]>([]);
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
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

  const setScrollRef = (scrollView: ComponentRef<typeof ScrollView> | null) => {
    scrollRef.current = scrollView;
  };

  useEffect(() => {
    let active = true;

    const loadMachines = async () => {
      try {
        const accounts = await Account.GetAll();
        const matchingAccounts = requestedAccountId
          ? accounts.filter((account) => account.account_id === requestedAccountId)
          : accounts;
        const accountMachines = await Machine.GetAllForAccounts(matchingAccounts);

        if (active) {
          setMachines(accountMachines);
          const requestedMachine = accountMachines.find((entry) =>
            entry.machine.machine_id === requestedMachineId,
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
  }, [requestedAccountId, requestedMachineId]);

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
      <C.Container scrollViewRef={setScrollRef} contentContainerStyle={{
        paddingTop: insets.top + 12,
      }}>
        <View style={styles.page}>
          <View style={styles.header}>
            <C.Typography text="Your machines" variant="heading" />
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
                  <Link href={`/Machines#${getMachineKey(activeMachine)}`} asChild>
                    <MachineDetailsCard
                      entry={activeMachine}
                      onRequest={openRequest}
                    />
                  </Link>

                </>
              ) : null}

              <MachineGrid
                machines={machines}
                selectedMachineKey={machineKey}
                onMachinePress={(entry) => {
                  setActiveMachineId(getMachineKey(entry));
                  scrollRef.current?.scrollTo({ y: 0, animated: true,  });
                }}
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
