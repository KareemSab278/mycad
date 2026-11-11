import { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import * as C from '../../../components';
import { styles } from '../styles';
import { getMachineKey, type AccountMachine, type RequestType } from './types';

type Props = {
  entry: AccountMachine;
  onRequest: (type: RequestType, machineKey: string) => void;
};
export const MachineDetailsCard = ({ entry, onRequest }: Props) => {
  const imageBaseUrl = process.env.EXPO_PUBLIC_MACHINE_IMAGE_URL?.replace(/\/+$/, '');

  const [imageSource, setImageSource] = useState(
    imageBaseUrl
      ? `${imageBaseUrl}/${encodeURIComponent(entry.machine.root_model || 0)}.png`
      : undefined,
  );

  useEffect(() => {
    setImageSource(
      imageBaseUrl
        ? `${imageBaseUrl}/${encodeURIComponent(entry.machine.root_model || 0)}.png`
        : undefined,
    );
  }, [imageBaseUrl, entry.machine.root_model]);
  return (
    <C.Card>
      <View style={styles.cardContent}>
        <View style={styles.machineHeading}>
          <View style={{ ...styles.headingText, paddingLeft: 20 }}>
            <C.Typography text={`Machine ${entry.machine.machine_id}`} variant="title" />
            <C.Typography text={`Model: ${entry.machine.model_code}`} variant="caption" />
            <C.Typography text={`${entry.account.company_name.trim()}`} variant="caption" />
            <C.Typography text={`${entry.machine.location.trim()}`} variant="caption" />
          </View>

          <Image
            source={{ uri: imageSource }}
            onError={() => setImageSource(`${imageBaseUrl}/0.png`)}
            resizeMode="contain"
            style={styles.machineDetailsImageCard}
          />
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
  )
};
