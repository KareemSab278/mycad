import { Pressable, View } from 'react-native';
import * as C from '../../../components';
import { useTheme } from '../../../hooks/use-theme';
import { formatDate } from '../helpers';
import { styles } from './styles';
import type { DateRangeProps } from './types';

export const DateRange = ({
  fromDate, untilDate, untilFurtherNotice, onDatePicker, onUntilFurtherNoticeChange, wide,
}: DateRangeProps) => {
  const theme = useTheme();
  const dateField = (label: string, value: Date, picker: 'from' | 'until') => (
    <View style={styles.field}>
      <C.Typography text={label} variant="caption" />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${formatDate(value)}`}
        onPress={() => onDatePicker(picker)}
        style={[styles.dateButton, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]}
      >
        <C.Typography text={formatDate(value)} style={styles.description} />
      </Pressable>
    </View>
  );

  return (
    <>
      <View style={[styles.fieldRow, wide && styles.fieldRowWide]}>
        {dateField('On/From Date', fromDate, 'from')}
        {!untilFurtherNotice && dateField('Until', untilDate, 'until')}
      </View>
      <C.CheckBox label="Until further notice" checked={untilFurtherNotice} onValueChange={onUntilFurtherNoticeChange} />
    </>
  );
};
