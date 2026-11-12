import { useEffect, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Account } from '../../api';
import * as C from '../../components';
import type { AccountInfo } from '../../types';
import type { BreakPeriod, Day, RuleType } from './helpers';
import {
  isRuleType, ruleTypes
} from './helpers';
import { ClosedDatesEditor, InformationEditor, OpeningHoursEditor, StaffChangesEditor } from './RuleEditors';
import { styles } from './styles';

const emptyBreaks = (): BreakPeriod[] => Array.from({ length: 3 }, () => ({ start: '', end: '' }));

export const Access = () => {
  const { width } = useWindowDimensions();
  const wide = width >= 800;
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [accountError, setAccountError] = useState('');
  const [ruleType, setRuleType] = useState<RuleType | null>(null);
  const [fromDate, setFromDate] = useState(() => new Date());
  const [untilDate, setUntilDate] = useState(() => new Date());
  const [untilFurtherNotice, setUntilFurtherNotice] = useState(false);
  const [staffLevel, setStaffLevel] = useState(100);
  const [staffLevelInput, setStaffLevelInput] = useState('100');
  const [opening, setOpening] = useState('');
  const [closing, setClosing] = useState('');
  const [breaks, setBreaks] = useState<BreakPeriod[]>(emptyBreaks);
  const [selectedDays, setSelectedDays] = useState<Day[]>([]);
  const [information, setInformation] = useState('');
  const [datePicker, setDatePicker] = useState<'from' | 'until' | null>(null);
  const [saveNotice, setSaveNotice] = useState(0);

  useEffect(() => {
    let active = true;

    const loadAccounts = async () => {
      try {
        const linkedAccounts = await Account.GetAll();
        if (active) {
          setAccounts(linkedAccounts);
          setSelectedAccountId(linkedAccounts[0]?.account_id ?? '');
        }
      } catch (error) {
        console.error('Unable to load linked accounts:', error);
        if (active) setAccountError('Unable to load your linked accounts. Please try again later.');
      } finally {
        if (active) setLoadingAccounts(false);
      }
    };

    void loadAccounts();
    return () => {
      active = false;
    };
  }, []);

  const selectedAccount = accounts.find((account) => account.account_id === selectedAccountId);

  const setBreak = (index: number, field: keyof BreakPeriod, value: string) => {
    setBreaks((current) => current.map((period, i) => i === index ? { ...period, [field]: value } : period));
  };

  const dateRange = {
    fromDate, untilDate, untilFurtherNotice, onDatePicker: setDatePicker,
    onUntilFurtherNoticeChange: setUntilFurtherNotice, wide,
  };
  const informationProps = { information, onInformationChange: setInformation };

  return (
    <SafeAreaView style={styles.page} edges={['top']}>
      <C.Container style={styles.page} keyboardShouldPersistTaps="handled">
        <C.Typography text="Site Settings" variant="heading" />

        <C.Box title={'1. ' + (accounts.length > 1 ? 'Your accounts' : 'Your account')}>
          {accountError ? (
            <C.Alert tone="error" title="Accounts unavailable" message={accountError} />
          ) : loadingAccounts ? (
            <C.Loader />
          ) : accounts.length ? (
            selectedAccount ? (
              <>
                {accounts.length > 1 ? (
                  <C.Selector
                    label="Select an account"
                    placeholder="Select an account"
                    options={accounts.map((account) => ({
                      label: account.company_name,
                      value: account.account_id,
                    }))}
                    value={selectedAccountId}
                    onValueChange={(accountId) => {
                      setSelectedAccountId(accountId);
                      setRuleType(null);
                      setSaveNotice(0);
                    }}
                  />
                ) : null}
                <C.Typography text={`${selectedAccount.account_id} - ${selectedAccount.company_name}`} variant="title" />
                <C.Typography
                  text={[
                    selectedAccount.address1.trim(),
                    selectedAccount.address2.trim(),
                    selectedAccount.town.trim(),
                    selectedAccount.county.trim(),
                    selectedAccount.postcode.trim(),
                  ].filter(Boolean).join(', ')}
                  variant="caption"
                />
              </>
            ) : null
          ) : (
            <C.Typography text="No linked accounts were found." variant="caption" />
          )}
        </C.Box>

        <C.Box title="2. Site Access Rules" description="Configure site access rules for the selected account.">
          <C.Typography text="Keep your site access information up to date so our operators know when they can visit." />

          {selectedAccount && ruleTypes.length > 0 &&
            <C.Selector
              label="Select A Rule Type"
              placeholder="None Selected"
              options={ruleTypes.map((option) => ({ label: option, value: option }))}
              value={ruleType ?? 'Select a rule type'}
              onValueChange={(value) => {
                if (isRuleType(value)) { setRuleType(value); setSaveNotice(0); }
              }}
            />}
        </C.Box>



        <C.Box title="3. Rule Details">
          {!selectedAccount && (
            <C.Typography text="Select an account to configure site access rules." />
          )}

          {selectedAccount && ruleType === null && (
            <C.Typography text="Please select a rule type to continue." />
          )}

          {selectedAccount && ruleType === 'Closed Dates' && (
            <ClosedDatesEditor dateRange={dateRange} {...informationProps} />
          )}

          {selectedAccount && ruleType === 'Staff Changes' && (
            <StaffChangesEditor
              dateRange={dateRange}
              staffLevel={staffLevel}
              staffLevelInput={staffLevelInput}
              onStaffLevelInputChange={(value) => {
                setStaffLevelInput(value);
                if (/^\d+$/.test(value) && Number(value) <= 200) setStaffLevel(Number(value));
              }}
              onStaffLevelChange={(value) => { setStaffLevel(value); setStaffLevelInput(String(value)); }}
              {...informationProps}
            />
          )}

          {selectedAccount && ruleType === 'Opening Hours' && (
            <OpeningHoursEditor
              wide={wide}
              opening={opening}
              closing={closing}
              breaks={breaks}
              selectedDays={selectedDays}
              onOpeningChange={setOpening}
              onClosingChange={setClosing}
              onBreakChange={setBreak}
              onDayChange={(day, checked) => setSelectedDays((current) => checked ? [...current, day] : current.filter((item) => item !== day))}
              {...informationProps}
            />
          )}

          {selectedAccount && ruleType === 'Information' && <InformationEditor {...informationProps} />}

          {selectedAccount && ruleType !== null && (
            <View style={styles.buttons}>
              <C.Buttons.Primary label="Save" onPress={() => setSaveNotice((count) => count + 1)} />
            </View>
          )}

        </C.Box>

      </C.Container>


      <C.Modal visible={datePicker !== null} onClose={() => setDatePicker(null)}>
        <C.Typography text={datePicker === 'from' ? 'Select start date' : 'Select end date'} variant="title" />
        {datePicker && (
          <C.Calendar
            key={datePicker}
            value={datePicker === 'from' ? fromDate : untilDate}
            onChange={(date) => {
              if (datePicker === 'from') setFromDate(date);
              else setUntilDate(date);
              setDatePicker(null);
            }}
          />
        )}
        <C.Buttons.Secondary label="Cancel" onPress={() => setDatePicker(null)} />
      </C.Modal>

      {saveNotice > 0 && (
        <C.Alert key={saveNotice} tone="info" title="Saving is not available yet." message="This rule has not been sent." />
      )}

    </SafeAreaView>
  );
};
