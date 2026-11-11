import { useState } from 'react';
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
  const [actionsModalOpen, setActionsModalOpen] = useState(false);
  const imageSource = imageBaseUrl
    ? `${imageBaseUrl}/${encodeURIComponent(entry.machine.root_model || 0)}.png`
    : undefined;
  const [failedImageSource, setFailedImageSource] = useState<string>();
  const displayedImageSource = imageSource === failedImageSource && imageBaseUrl
    ? `${imageBaseUrl}/0.png`
    : imageSource;

  const request = (type: RequestType) => {
    onRequest(type, getMachineKey(entry));
    setActionsModalOpen(false);
  };

  return (
    <>
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
              source={{ uri: displayedImageSource }}
              onError={() => {
                if (imageSource) setFailedImageSource(imageSource);
              }}
              resizeMode="contain"
              style={styles.machineDetailsImageCard}
            />
          </View>

          <C.Buttons.Secondary
            label="Support"
            onPress={() => setActionsModalOpen(true)}
          />
        </View>
      </C.Card>

      <C.Modal visible={actionsModalOpen} onClose={() => setActionsModalOpen(false)}>
        <View style={styles.modalContent}>
          <C.Typography text="What do you need help with?" variant="title" />
          <C.Buttons.Primary
            label="Request maintenance"
            onPress={() => request('Maintenance')}
          />
          <C.Buttons.Secondary
            label="Customer support"
            onPress={() => request('Support')}
          />
          <C.Buttons.Secondary
            label="Request refund"
            onPress={() => request('Refund')}
          />
          <C.Buttons.Secondary
            label="Cancel"
            onPress={() => setActionsModalOpen(false)}
          />
        </View>
      </C.Modal>
    </>
  );
};
