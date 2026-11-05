import { View } from 'react-native';
import * as C from '../../../components';
import { fakeMachines } from '../../../fakeAccountInfo';
import { useTheme } from '../../../hooks/use-theme';
import type { CareScheduleItem } from '../../../types';
import { styles } from '../styles';

export const DeliveryScheduleCard = () => {
  const theme = useTheme();

  return (
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
  );
};

export const CareScheduleCard = ({ items }: { items: CareScheduleItem[] }) => {
  const theme = useTheme();

  return (
    <C.Card>
      <View style={styles.cardContent}>
        <C.Typography text="Customer care schedule" variant="title" />
        <C.Typography text="Sample check-ins to help keep your account running smoothly" variant="caption" />
        {items.map((item) => (
          <View key={item.milestone} style={[styles.scheduleItem, { borderColor: theme.border }]}>
            <C.Typography text={`${item.milestone} · ${item.date}`} variant="body" />
            <C.Typography text={item.detail} variant="caption" />
          </View>
        ))}
        {items.length === 0 ? (
          <C.Typography text="No customer care check-ins are scheduled for this account." variant="caption" />
        ) : null}
      </View>
    </C.Card>
  );
};
