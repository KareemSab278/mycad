import { useEffect, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as C from '../../components';
import { useNav } from '../../helpers/navigation';
import * as Ls from '../../storage';
import type { SingleAccountInfo } from '../../types';
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
  const nav = useNav();
  const [account, setAccount] = useState<SingleAccountInfo | null>(null);
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

    const loadAccount = async () => {
      try {
        const savedAccount = await Ls.Creds.get();
        if (!savedAccount) {
          if (active) setAccountError('No signed-in account was found. Sign in again to manage site orders.');
          return;
        }
        if (active) setAccount(savedAccount);
      } catch (error) {
        console.error('Unable to load site access data:', error);
        if (active) setAccountError('Unable to load your sites. Please try again later.');
      }
    };

    void loadAccount();
    return () => {
      active = false;
    };
  }, []);

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

        <C.Box title="Manage site orders" description="Choose a site to review or edit the products in its next order.">
          {accountError ? (
            <C.Alert tone="error" title="Sites unavailable" message={accountError} />
          ) : account?.business_accounts.flatMap((businessAccount) =>
            businessAccount.sites.map((site) => (
              <View key={`${businessAccount.name}-${site.name}`} style={styles.siteButton}>
                <C.Typography text={businessAccount.name} variant="caption" />
                <C.Buttons.Secondary
                  label={site.name}
                  onPress={() => nav.to('/Orders', {
                    params: {
                      account_name: businessAccount.name,
                      site_name: site.name,
                    },
                  })}
                />
              </View>
            )),
          ) ?? (
            <C.Typography text="Loading your sites…" variant="caption" />
          )}
          {account && account.business_accounts.every((businessAccount) => businessAccount.sites.length === 0) ? (
            <C.Typography text="No sites are available for this account." variant="caption" />
          ) : null}
        </C.Box>

        <C.Box title="Site Access Rules" description="Configure the rules for accessing your site.">
          <C.Typography text="Keep your site information up to date so our operators know when they can visit." />

          {ruleTypes.length > 0 &&
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



        <C.Box title="Rule Details">
          {ruleType === null && (
            <C.Typography text="Please select a rule type to continue." />
          )}

          {ruleType === 'Closed Dates' && (
            <ClosedDatesEditor dateRange={dateRange} {...informationProps} />
          )}

          {ruleType === 'Staff Changes' && (
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

          {ruleType === 'Opening Hours' && (
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

          {ruleType === 'Information' && <InformationEditor {...informationProps} />}

          {ruleType !== null && (
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
