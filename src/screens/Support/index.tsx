import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as C from '../../components';
import * as Ls from '../../storage';
import type { CareScheduleItem } from '../../types';
import { InvoiceHistoryModal } from '../Home/InvoiceHistoryModal';
import {
  CareScheduleCard,
  DeliveryScheduleCard,
  SupportActionCards,
  SupportRequestHistoryCard,
  SupportRequestModal,
} from './Components';
import type { ContactDetails, SupportRequest } from './Components';
import { styles } from './styles';

export const Support = () => {
  const insets = useSafeAreaInsets();
  const [contact, setContact] = useState<ContactDetails | null>(null);
  const [accountError, setAccountError] = useState('');
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [careSchedule, setCareSchedule] = useState<CareScheduleItem[]>([]);
  const [machineId, setMachineId] = useState('');
  const [description, setDescription] = useState('');
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [invoicesVisible, setInvoicesVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);

  useEffect(() => {
    let active = true;

    const loadContact = async () => {
      try {
        const account = await Ls.Creds.get();
        if (!account) {
          if (active) setAccountError('No signed-in account was found. Sign in again to submit a support request.');
          return;
        }

        if (active) {
          const businessAccount = account.business_accounts[0];
          setContact({
            email: account.login.email,
            accountName: businessAccount?.name ?? 'No business account linked',
          });
          setCareSchedule(businessAccount?.careSchedule ?? []);
        }
      } catch (error) {
        console.error('Unable to load support contact details:', error);
        if (active) setAccountError('Unable to load your account details. Please try again later.');
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
          <DeliveryScheduleCard />
          <CareScheduleCard items={careSchedule} />
          <SupportRequestHistoryCard requests={requests} />
        </View>
      </C.Container>
    </>
  );
};
