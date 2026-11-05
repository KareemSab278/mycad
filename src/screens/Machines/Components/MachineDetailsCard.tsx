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
          <C.Typography text={entry.machine.name} variant="title" />
          {entry.machine.id ? (
            <C.Typography text={`Machine ID: ${entry.machine.id}`} variant="caption" />
          ) : null}
          {entry.machine.model ? (
            <C.Typography text={entry.machine.model} variant="caption" />
          ) : null}
          <C.Typography text={`${entry.accountName} · ${entry.siteName}`} variant="caption" />
        </View>
        {entry.machine.status ? (
          <C.Typography text={entry.machine.status} variant="caption" />
        ) : null}
      </View>

      <View style={styles.details}>
        {[
          ['Account arrangement', entry.machine.arrangement],
          ['Next delivery', entry.machine.nextDelivery],
          ['Last serviced', entry.machine.lastServiced],
        ].filter((item): item is [string, string] => Boolean(item[1])).map(([label, value]) => (
          <View key={label} style={styles.detail}>
            <C.Typography text={label} variant="caption" />
            <C.Typography text={value} variant="body" />
          </View>
        ))}
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
