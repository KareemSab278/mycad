import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as C from '../../components';
import { useTheme } from '../../hooks/use-theme';
import type { BreakPeriod, Day, Rule, RuleType } from './helpers';
import {
  dateValue, isRule, isRuleType, ruleTypes, timeInMinutes,
} from './helpers';
import { ClosedDatesEditor, InformationEditor, OpeningHoursEditor, StaffChangesEditor } from './RuleEditors';
import { styles } from './styles';

const STORAGE_KEY = 'site-access-rules';
const emptyBreaks = (): BreakPeriod[] => Array.from({ length: 3 }, () => ({ start: '', end: '' }));

export const Access = () => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const wide = width >= 800;
  const [type, setType] = useState<RuleType>('Closed Dates');
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
  const [rules, setRules] = useState<Rule[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ruleToRemove, setRuleToRemove] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  useEffect(() => {
    let active = true;
    const loadRules = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed: unknown = stored === null ? [] : JSON.parse(stored);
        if (!Array.isArray(parsed) || !parsed.every(isRule)) {
          throw new Error('Stored access rules are invalid.');
        }
        if (active) {
          setRules(parsed);
          setStorageReady(true);
        }
      } catch (error) {
        console.error('Unable to load site access rules:', error);
        if (active) setMessage({ text: 'Could not load local rules. Saving is unavailable; please restart the app and try again.', error: true });
      }
    };
    void loadRules();
    return () => { active = false; };
  }, []);

  const resetForm = () => {
    setType('Closed Dates');
    setFromDate(new Date());
    setUntilDate(new Date());
    setUntilFurtherNotice(false);
    setStaffLevel(100);
    setStaffLevelInput('100');
    setOpening('');
    setClosing('');
    setBreaks(emptyBreaks());
    setSelectedDays([]);
    setInformation('');
    setDatePicker(null);
  };

  const save = async () => {
    if (!storageReady || saving) return;
    const base = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, type, information: information.trim() };
    let rule: Rule;

    if (type === 'Closed Dates' || type === 'Staff Changes') {
      if (type === 'Staff Changes' && (!/^\d+$/.test(staffLevelInput) || Number(staffLevelInput) > 200)) {
        setMessage({ text: 'Enter a staff level between 0 and 200 percent.', error: true });
        return;
      }
      if (!untilFurtherNotice && dateValue(untilDate) < dateValue(fromDate)) {
        setMessage({ text: 'The end date must be on or after the start date.', error: true });
        return;
      }
      rule = {
        ...base,
        fromDate: dateValue(fromDate),
        untilDate: untilFurtherNotice ? null : dateValue(untilDate),
        ...(type === 'Staff Changes' ? { staffLevel } : {}),
      };
    } else if (type === 'Opening Hours') {
      const open = timeInMinutes(opening);
      const close = timeInMinutes(closing);
      if (open === null || close === null || close <= open) {
        setMessage({ text: 'Enter valid opening and closing times in 24-hour format, with closing after opening.', error: true });
        return;
      }
      if (!selectedDays.length) {
        setMessage({ text: 'Select at least one day of the week.', error: true });
        return;
      }
      const filledBreaks = breaks.filter((period) => period.start.trim() || period.end.trim());
      for (const period of filledBreaks) {
        const start = timeInMinutes(period.start);
        const end = timeInMinutes(period.end);
        if (start === null || end === null || start >= end || start < open || end > close) {
          setMessage({ text: 'Enter both times for each break, within the opening hours and with the end after the start.', error: true });
          return;
        }
      }
      rule = { ...base, opening: opening.trim(), closing: closing.trim(), breaks: filledBreaks, days: selectedDays };
    } else {
      if (!base.information) {
        setMessage({ text: 'Enter the information our operators need to know.', error: true });
        return;
      }
      rule = base;
    }

    setSaving(true);
    try {
      const nextRules = [...rules, rule];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextRules));
      setRules(nextRules);
      resetForm();
      setMessage({ text: 'Rule saved on this device only. It has not been sent to Coinadrink.', error: false });
    } catch (error) {
      console.error('Unable to save site access rule:', error);
      setMessage({ text: 'Could not save this rule on your device. Please try again.', error: true });
    } finally {
      setSaving(false);
    }
  };

  const setBreak = (index: number, field: keyof BreakPeriod, value: string) => {
    setBreaks((current) => current.map((period, i) => i === index ? { ...period, [field]: value } : period));
  };

  const removeRule = async () => {
    if (!storageReady || saving || ruleToRemove === null) return;
    setSaving(true);
    try {
      const nextRules = rules.filter((rule) => rule.id !== ruleToRemove);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextRules));
      setRules(nextRules);
      setRuleToRemove(null);
      setMessage({ text: 'Local rule removed from this device.', error: false });
    } catch (error) {
      console.error('Unable to remove site access rule:', error);
      setRuleToRemove(null);
      setMessage({ text: 'Could not remove the local rule. Please try again.', error: true });
    } finally {
      setSaving(false);
    }
  };

  const dateRange = {
    fromDate, untilDate, untilFurtherNotice, onDatePicker: setDatePicker,
    onUntilFurtherNoticeChange: setUntilFurtherNotice, wide,
  };
  const informationProps = { information, onInformationChange: setInformation };

  return (
    <>
      <SafeAreaView style={[styles.page, { backgroundColor: theme.background }]} edges={['top']}>
        <C.Container style={styles.page} contentContainerStyle={[styles.content, wide && styles.layoutWide]} keyboardShouldPersistTaps="handled">
          <C.Box title="Site Access">
          <C.Typography text="Keep your site information up to date so our operators know when they can visit." />
          </C.Box>
          <View style={[styles.form, wide && styles.formWide]}>
            <C.Box title="New Site Access Rule">
              <View style={styles.section}>
                <C.Typography text="Rule Type" style={styles.sectionTitle} />
                <C.Typography text="Select the type of rule and fill in the related fields." style={styles.description} />
                <C.Typography text="You can create as many rules as you need." variant="caption" style={styles.note} />
                <View style={styles.fields}>
                  <C.Selector placeholder="Rule Type" options={ruleTypes.map((option) => ({ label: option, value: option }))} value={type} onValueChange={(value) => {
                    if (isRuleType(value)) { setType(value); if (storageReady) setMessage(null); }
                  }} />
                </View>
              </View>
            </C.Box>
            <C.Box title="Rule Details">
              {type === 'Closed Dates' && (
                <ClosedDatesEditor dateRange={dateRange} {...informationProps} />
              )}
              {type === 'Staff Changes' && (
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
              {type === 'Opening Hours' && (
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
              {type === 'Information' && <InformationEditor {...informationProps} />}
              {message && (
                <View accessibilityRole="alert" style={[styles.message, { backgroundColor: message.error ? '#fff1f0' : '#e5f8f5' }]}>
                  <C.Typography text={message.text} style={{ color: message.error ? '#9b1c1c' : '#11665f', fontSize: 14 }} />
                </View>
              )}
              <View style={styles.buttons}>
                <C.Buttons.Primary label={saving ? 'Saving...' : 'Save'} onPress={() => void save()} isDisabled={!storageReady || saving} />
                <C.Buttons.Danger label="Cancel" onPress={() => { resetForm(); if (storageReady) setMessage(null); }} isDisabled={saving} />
              </View>
            </C.Box>
          </View>
        </C.Container>
      </SafeAreaView>
      <C.Modal visible={datePicker !== null} onClose={() => setDatePicker(null)}>
        <View style={styles.modal}>
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
        </View>
      </C.Modal>
      <C.Dialog
        visible={ruleToRemove !== null}
        onClose={() => setRuleToRemove(null)}
        title="Remove local rule?"
        description="This removes the rule from this device."
      >
        <View style={styles.buttons}>
          <C.Buttons.Danger label="Remove" onPress={() => void removeRule()} isDisabled={saving} style={styles.cancelButton} />
          <C.Buttons.Secondary label="Cancel" onPress={() => setRuleToRemove(null)} isDisabled={saving} style={styles.cancelButton} />
        </View>
      </C.Dialog>
    </>
  );
};
