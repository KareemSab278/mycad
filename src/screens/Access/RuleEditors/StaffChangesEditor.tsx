import { View } from 'react-native';
import * as C from '../../../components';
import { useTheme } from '../../../hooks/use-theme';
import { DateRange } from './DateRange';
import { OperatorInformation } from './OperatorInformation';
import { styles } from './styles';
import type { DateRangeProps, InformationProps } from './types';

type StaffChangesEditorProps = InformationProps & {
  dateRange: DateRangeProps;
  staffLevel: number;
  staffLevelInput: string;
  onStaffLevelInputChange: (value: string) => void;
  onStaffLevelChange: (value: number) => void;
};

export const StaffChangesEditor = ({
  dateRange, staffLevel, staffLevelInput, onStaffLevelInputChange, onStaffLevelChange, ...information
}: StaffChangesEditorProps) => {
  const theme = useTheme();

  return (
    <>
      <View style={styles.section}>
        <C.Typography text="Staff Levels" style={styles.sectionTitle} />
        <C.Typography text="Let us know if the number of staff on site is going to change." style={styles.description} />
        <C.Typography text="An estimate is fine. You can specify the dates of this change below." variant="caption" style={styles.note} />
        <View style={styles.fields}>
          <View style={styles.section}>
            <C.TextField
              label="Staff Level (%)"
              value={staffLevelInput}
              onChangeText={onStaffLevelInputChange}
              keyboardType="number-pad"
              style={[styles.input, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
            />
            <View style={styles.sliderLabels}>
              <C.Typography text="0%" variant="caption" />
              <C.Typography text={`${staffLevel}%`} style={styles.sliderValue} />
              <C.Typography text="200%" variant="caption" />
            </View>
            <C.Slider value={staffLevel} onValueChange={onStaffLevelChange} min={0} max={200} step={5} accessibilityLabel="Staff level percentage" />
          </View>
          <DateRange {...dateRange} />
        </View>
      </View>
      <OperatorInformation {...information} />
    </>
  );
};
