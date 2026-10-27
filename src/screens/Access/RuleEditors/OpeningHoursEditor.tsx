import { View } from 'react-native';
import * as C from '../../../components';
import { useTheme } from '../../../hooks/use-theme';
import type { BreakPeriod, Day } from '../helpers';
import { days } from '../helpers';
import { OperatorInformation } from './OperatorInformation';
import { styles } from './styles';
import type { InformationProps } from './types';

type OpeningHoursEditorProps = InformationProps & {
  wide: boolean;
  opening: string;
  closing: string;
  breaks: BreakPeriod[];
  selectedDays: Day[];
  onOpeningChange: (value: string) => void;
  onClosingChange: (value: string) => void;
  onBreakChange: (index: number, field: keyof BreakPeriod, value: string) => void;
  onDayChange: (day: Day, checked: boolean) => void;
};

export const OpeningHoursEditor = ({
  wide, opening, closing, breaks, selectedDays, onOpeningChange, onClosingChange,
  onBreakChange, onDayChange, ...information
}: OpeningHoursEditorProps) => {
  const theme = useTheme();
  const textInputStyle = [styles.input, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }];
  const timeField = (label: string, value: string, onChangeText: (value: string) => void) => (
    <View style={styles.field}>
      <C.TextField label={label} value={value} onChangeText={onChangeText} placeholder="HH:MM" placeholderTextColor={theme.textSecondary} style={textInputStyle} />
    </View>
  );

  return (
    <>
      <View style={styles.section}>
        <C.Typography text="Opening and Closing Times" style={styles.sectionTitle} />
        <C.Typography text="Our operators should be able to access your site between these times. Use 24-hour format, for example 09:00." style={styles.description} />
        <View style={[styles.fields, wide && styles.fieldRowWide]}>
          {timeField('Opening', opening, onOpeningChange)}
          {timeField('Closing', closing, onClosingChange)}
        </View>
      </View>
      <View style={styles.section}>
        <C.Typography text="Break and Lunch Periods" style={styles.sectionTitle} />
        <C.Typography text="Only add times for periods during the day when we cannot visit." style={styles.description} />
        <View style={styles.fields}>
          {breaks.map((period, index) => (
            <View key={index} style={[styles.fieldRow, wide && styles.fieldRowWide]}>
              {timeField(`Break ${index + 1} - Starts`, period.start, (value) => onBreakChange(index, 'start', value))}
              {timeField(`Break ${index + 1} - Ends`, period.end, (value) => onBreakChange(index, 'end', value))}
            </View>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <C.Typography text="Days of the Week" style={styles.sectionTitle} />
        <C.Typography text="Select the days when these opening hours and break periods apply." style={styles.description} />
        <C.Typography text="Create additional rules for days with different hours." variant="caption" style={styles.note} />
        <View style={styles.dayRow}>
          {days.map((day) => (
            <C.CheckBox key={day} label={day} checked={selectedDays.includes(day)} onValueChange={(checked) => onDayChange(day, checked)} />
          ))}
        </View>
      </View>
      <OperatorInformation {...information} />
    </>
  );
};
