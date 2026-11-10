import { View } from 'react-native';
import * as C from '../../../components';
import { useTheme } from '../../../hooks/use-theme';
import { styles } from '../styles';

export const DeliveryScheduleCard = () => {
  return (
    <C.Card>
      <View style={styles.cardContent}>
        <C.Typography text="Delivery schedule" variant="title" />
        <C.Typography text="Coming soon." variant="caption" />
      </View>
    </C.Card>
  );
};

export const CareScheduleCard = () => {
  const theme = useTheme();

  return (
    <C.Card>
      <View style={styles.cardContent}>
        <C.Typography text="Customer care schedule" variant="title" />
        <View style={[styles.scheduleItem, { borderColor: theme.border }]}>
          <C.Typography text="Coming soon." variant="caption" />
        </View>
      </View>
    </C.Card>
  );
};
