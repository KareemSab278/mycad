import { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as C from '../../components';
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

        <C.Box>
          <C.Typography text="Site Access Rules" variant="heading" />
          <C.Typography text="Keep your site information up to date so our operators know when they can visit." />

          {ruleTypes.length > 0 && <C.Selector
            label="Select A Rule Type"
            placeholder="Rule Type"
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
