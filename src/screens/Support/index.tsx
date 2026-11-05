import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as C from '../../components';
import { fakeMachines } from '../../fakeAccountInfo';
import { useTheme } from '../../hooks/use-theme';
import * as Ls from '../../storage';
import type { CareScheduleItem } from '../../types';
import { InvoiceHistoryModal } from '../Home/InvoiceHistoryModal';

type ContactDetails = {
  email: string;
  accountName: string;
};

type SupportRequest = {
  id: string;
  email: string;
  accountName: string;
  machineId: string;
  description: string;
  date: string;
};

export const Support = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
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
      <C.Modal visible={helpModalVisible} onClose={() => setHelpModalVisible(false)}>
        <KeyboardAwareScrollView
          bottomOffset={24}
          keyboardShouldPersistTaps="handled"
          mode="layout"
          style={styles.modalScroll}
          contentContainerStyle={styles.modalContent}
        >
          <C.Typography text="Ask for help" variant="title" />
          <C.Typography
            text={contact ? `Your signed-in email and account (${contact?.accountName ?? (loadingAccount ? 'Loading…' : 'Unavailable')}) are attached automatically.`: 'Error: No account information available.'}
            variant="caption"
          />
          {accountError ? (
            <C.Alert tone="error" title="Account unavailable" message={accountError} />
          ) : null}
          <C.TextField
            label="Machine ID (optional)"
            value={machineId}
            onChangeText={setMachineId}
            placeholder="Enter the machine ID if relevant"
            autoCapitalize="characters"
          />
          <C.TextArea
            label="Describe the issue"
            value={description}
            onChangeText={setDescription}
            placeholder="How can we help?"
            textAlignVertical="top"
          />
          <C.Buttons.Primary
            label="Record support request"
            onPress={submitRequest}
            isDisabled={loadingAccount || !contact || !description.trim()}
          />
          <C.Buttons.Secondary
            label="Cancel"
            onPress={() => setHelpModalVisible(false)}
          />
        </KeyboardAwareScrollView>
      </C.Modal>
      <C.Container contentContainerStyle={{ paddingTop: insets.top + 12 }}>
        <View style={styles.stack}>
          <View style={styles.header}>
            <C.Typography text="Support & billing" variant="heading" />
            <C.Typography text="Get help, check your schedules, and view invoices." variant="body" />
          </View>

          <C.Card>
            <View style={styles.cardContent}>
              <C.Typography text="Invoices" variant="title" />
              <C.Typography text="Review your recent invoice history and open an invoice." variant="body" />
              <C.Buttons.Primary label="Show invoices" onPress={() => setInvoicesVisible(true)} />
            </View>
          </C.Card>

          <C.Card>
            <View style={styles.cardContent}>
              <C.Typography text="Delivery schedule" variant="title" />
              <C.Typography text="Upcoming sample deliveries" variant="caption" />
              {fakeMachines.map((machine) => (
                <View key={machine.id} style={[styles.scheduleItem, { borderColor: theme.border }]}>
                  <C.Typography text={machine.name} variant="body" />
                  <C.Typography text={`${machine.nextDelivery} · Regular stock delivery`} variant="caption" />
                </View>
              ))}
            </View>
          </C.Card>

          <C.Card>
            <View style={styles.cardContent}>
              <C.Typography text="Customer care schedule" variant="title" />
              <C.Typography text="Sample check-ins to help keep your account running smoothly" variant="caption" />
              {careSchedule.map((item) => (
                <View key={item.milestone} style={[styles.scheduleItem, { borderColor: theme.border }]}>
                  <C.Typography text={`${item.milestone} · ${item.date}`} variant="body" />
                  <C.Typography text={item.detail} variant="caption" />
                </View>
              ))}
              {careSchedule.length === 0 ? (
                <C.Typography text="No customer care check-ins are scheduled for this account." variant="caption" />
              ) : null}
            </View>
          </C.Card>


        <C.Card>
          <View style={styles.cardContent}>
            <C.Typography text="Ask for help" variant="title" />
            <C.Typography text="Have a question or issue? Send us the details." variant="body" />
            <C.Buttons.Danger
              label="Ask for help"
              onPress={() => setHelpModalVisible(true)}
            />
          </View>
        </C.Card>

        {requests.length > 0 ? (
          <C.Card>
            <View style={styles.cardContent}>
              <C.Typography text="Your support requests" variant="title" />
              {requests.map((request) => (
                <View key={request.id} style={[styles.request, { borderColor: theme.border }]}>
                  <C.Typography text={`${request.id} · ${request.date}`} variant="title" />
                  <C.Typography text={request.description} variant="body" />
                  <C.Typography
                    text={`Email: ${request.email} · Account: ${request.accountName}${request.machineId ? ` · Machine: ${request.machineId}` : ''}`}
                    variant="caption"
                  />
                </View>
              ))}
            </View>
          </C.Card>
        ) : null}

        </View>
      </C.Container>
    </>
  );
};

const styles = StyleSheet.create({
  stack: {
    gap: 16,
    paddingBottom: 24,
  },
  header: {
    gap: 6,
  },
  cardContent: {
    gap: 12,
  },
  modalContent: {
    gap: 12,
    paddingBottom: 8,
  },
  modalScroll: {
    flexShrink: 1,
    maxHeight: '100%',
  },
  request: {
    borderTopWidth: 1,
    gap: 6,
    paddingTop: 12,
  },
  scheduleItem: {
    borderTopWidth: 1,
    gap: 4,
    paddingTop: 12,
  },
});
