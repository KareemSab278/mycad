import { View } from 'react-native';
import * as C from '../../../components';
import { styles } from '../styles';
import { getMachineKey, type AccountMachine, type RequestType } from './types';

type Props = {
  entry: AccountMachine;
  onRequest: (type: RequestType, machineKey: string) => void;
};

export const MachineDetailsCard = ({ entry, onRequest }: Props) => (
  <C.Card>
    <View style={styles.cardContent}>
      <View style={styles.machineHeading}>
        <View style={styles.headingText}>
          <C.Typography text={`Machine ${entry.machine.machine_id}`} variant="title" />
          <C.Typography text={`Machine ID: ${entry.machine.machine_id}`} variant="caption" />
          <C.Typography text={`Model: ${entry.machine.model_code}`} variant="caption" />
          <C.Typography text={`${entry.account.company_name.trim()} · ${entry.machine.location.trim()}`} variant="caption" />
        </View>
      </View>

      <View style={styles.actionStack}>
        <C.Buttons.Primary
          label="Request maintenance"
          onPress={() => onRequest('Maintenance', getMachineKey(entry))}
        />
        <C.Buttons.Secondary
          label="Ask for support"
          onPress={() => onRequest('Support', getMachineKey(entry))}
        />
        <C.Buttons.Secondary
          label="Request refund"
          onPress={() => onRequest('Refund', getMachineKey(entry))}
        />
      </View>
    </View>
  </C.Card>
);
