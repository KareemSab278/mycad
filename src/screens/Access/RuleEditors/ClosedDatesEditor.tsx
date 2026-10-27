import { View } from 'react-native';
import * as C from '../../../components';
import { DateRange } from './DateRange';
import { OperatorInformation } from './OperatorInformation';
import { styles } from './styles';
import type { DateRangeProps, InformationProps } from './types';

export const ClosedDatesEditor = ({ dateRange, ...information }: InformationProps & { dateRange: DateRangeProps }) => (
  <>
    <View style={styles.section}>
      <C.Typography text="Closed Dates" style={styles.sectionTitle} />
      <C.Typography text="Let us know if your business will be closed on a specific date or over a period." style={styles.description} />
      <C.Typography text="For weekly opening hours, create a separate Opening Hours rule." variant="caption" style={styles.note} />
      <View style={styles.fields}>
        <DateRange {...dateRange} />
      </View>
    </View>
    <OperatorInformation {...information} />
  </>
);
