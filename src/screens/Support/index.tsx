import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Account, User } from '../../api';
import * as C from '../../components';
import { InvoiceHistoryModal } from '../Home/InvoiceHistoryModal';
import { ServiceHistoryModal } from '../Machines/Components/ServiceHistoryModal';
import {
  CareScheduleCard,
  DeliveryScheduleCard,
  SupportActionCards,
  SupportRequestHistoryCard,
  SupportRequestModal,
} from './Components';
import type { ContactDetails, SupportRequest } from './Components';
import type { AccountInfo } from '../../types';
import { styles } from './styles';

export const Support = () => {
  const insets = useSafeAreaInsets();
  const [contact, setContact] = useState<ContactDetails | null>(null);
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [serviceHistoryAccountId, setServiceHistoryAccountId] = useState('');
  const [accountError, setAccountError] = useState('');
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [machineId, setMachineId] = useState('');
  const [description, setDescription] = useState('');
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [invoicesVisible, setInvoicesVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [serviceHistoryVisible, setServiceHistoryVisible] = useState(false);

  useEffect(() => {
    let active = true;

    const loadContact = async () => {
      try {
        const [user, accounts] = await Promise.all([
          User.GetInfo(),
          Account.GetAll(),
        ]);

        if (active) {
          setAccounts(accounts);
          setSelectedAccountId(accounts[0]?.account_id ?? '');
          setServiceHistoryAccountId(accounts[0]?.account_id ?? '');
          setContact({
            email: user.email,
            accountName: accounts[0]?.company_name ?? 'No business account linked',
          });
        }
      } catch (error) {
        console.error('Unable to load support contact information:', error);
        if (active) setAccountError('Unable to load your signed-in account details. Please try again later.');
      } finally {
        if (active) setLoadingAccount(false);
      }
    };

    void loadContact();
    return () => {
      active = false;
    };
  }, []);

  const submitRequest = () => {
    const trimmedDescription = description.trim();
    if (!contact || !trimmedDescription) return;

    setRequests((current) => [{
      id: `SR-${Date.now()}`,
      email: contact.email,
      accountName: contact.accountName,
      machineId: machineId.trim(),
      description: trimmedDescription,
      date: new Date().toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }),
    }, ...current]);
    setMachineId('');
    setDescription('');
    setHelpModalVisible(false);
  };

  return (
    <>
      <InvoiceHistoryModal visible={invoicesVisible} onClose={() => setInvoicesVisible(false)} />
      <ServiceHistoryModal
        visible={serviceHistoryVisible}
        onClose={() => setServiceHistoryVisible(false)}
        scope={{ type: 'account', accountId: serviceHistoryAccountId }}
      />
      <SupportRequestModal
        visible={helpModalVisible}
        onClose={() => setHelpModalVisible(false)}
        contact={contact}
        loadingAccount={loadingAccount}
        accountError={accountError}
        machineId={machineId}
        onMachineIdChange={setMachineId}
        description={description}
        onDescriptionChange={setDescription}
        onSubmit={submitRequest}
      />
      <C.Container contentContainerStyle={{ paddingTop: insets.top + 12 }}>
        <View style={styles.stack}>
          <View style={styles.header}>
            <C.Typography text="Support & billing" variant="heading" />
            <C.Typography text="Get help, check your schedules, and view invoices." variant="body" />
          </View>

          <SupportActionCards
            onShowInvoices={() => setInvoicesVisible(true)}
            onAskForHelp={() => setHelpModalVisible(true)}
          />
          <C.Box title="Service call history">
            {loadingAccount ? (
              <C.Loader />
            ) : accountError ? (
              <C.Typography text={accountError} variant="caption" />
            ) : accounts.length === 0 ? (
              <C.Typography text="No linked business accounts were found." variant="caption" />
            ) : (
              <>
                <C.Selector
                  label="Select an account"
                  options={accounts.map((account) => ({
                    label: account.company_name,
                    value: account.account_id,
                  }))}
                  value={serviceHistoryAccountId}
                  onValueChange={setServiceHistoryAccountId}
                />
                <C.Buttons.Secondary
                  label="View service calls"
                  onPress={() => setServiceHistoryVisible(true)}
                />
              </>
            )}
          </C.Box>
          <DeliveryScheduleCard
            accounts={accounts}
            loadingAccounts={loadingAccount}
            accountError={accountError}
            selectedAccountId={selectedAccountId}
            onAccountChange={setSelectedAccountId}
          />
          <CareScheduleCard />
          <SupportRequestHistoryCard requests={requests} />
        </View>
      </C.Container>
    </>
  );
};
