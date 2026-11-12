import { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import * as C from '../../../components';
import { useTheme } from '../../../hooks/use-theme';
import { styles } from '../styles';
import { MachineFilters } from './MachineFilters';
import { getMachineKey, type AccountMachine } from './types';

type Props = {
  machines: AccountMachine[];
  onMachinePress: (entry: AccountMachine) => void;
  selectedMachineKey?: string;
};

type MachineTileProps = {
  entry: AccountMachine;
  imageBaseUrl?: string;
  isSelected: boolean;
  onPress: () => void;
};

const MachineTile = ({ entry, imageBaseUrl, isSelected, onPress }: MachineTileProps) => {
  const theme = useTheme();
  const [imageSource, setImageSource] = useState(
    imageBaseUrl
      ? `${imageBaseUrl}/${encodeURIComponent(entry.machine.root_model || 0)}.png`
      : undefined,
  );
  const machineName = `Machine ${entry.machine.machine_id}`;
  const location = entry.machine.location.trim() || 'Location unavailable';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${machineName}, ${location}`}
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      style={[
        styles.machineTile,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: isSelected ? theme.button : theme.border,
        },
      ]}
    >
      {imageSource ? (
        <Image
          source={{ uri: imageSource }}
          onError={() => setImageSource(`${imageBaseUrl}/0.png`)}
          resizeMode="contain"
          style={[styles.machineImage, { backgroundColor: theme.backgroundSelected }]}
        />
      ) : (
        <View style={[styles.machineImage, { backgroundColor: theme.backgroundSelected }]} />
      )}
      <View style={styles.machineTileContent}>
        <C.Typography text={machineName} variant="body" />
        <C.Typography text={location} variant="caption" />
      </View>
    </Pressable>
  );
};

export const MachineGrid = ({
  machines,
  onMachinePress,
  selectedMachineKey,
}: Props) => {
  const [machineSearch, setMachineSearch] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const imageBaseUrl = process.env.EXPO_PUBLIC_MACHINE_IMAGE_URL?.replace(/\/+$/, '');
  const showFilters = machines.length > 9;
  const modelFilters = [...new Set(machines.map(({ machine }) => machine.model_code.trim() || 'Unknown model'))]
    .sort((first, second) => first.localeCompare(second));

  const visibleMachines = machines.filter(({ account, machine }) => {
    if (!showFilters) return true;

    const model = machine.model_code.trim() || 'Unknown model';
    const matchesModel = !selectedModel || selectedModel === model;
    const searchableText = [
      machine.machine_id,
      machine.model_code,
      machine.location,
      account.company_name,
    ].join(' ').toLowerCase();

    return matchesModel && searchableText.includes(machineSearch.trim().toLowerCase()) && (!selectedAccount || selectedAccount === account.account_id);
  });

  return (
    <View style={styles.machineGridContainer}>

      <MachineFilters
        showFilters={showFilters}
        machines={machines}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        modelFilters={modelFilters}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />

      <C.SearchField
        placeholder="Search machines"
        value={machineSearch}
        onChangeText={setMachineSearch}
      />

      {visibleMachines.length > 0 ? (
        <View style={styles.machineGrid}>
          {visibleMachines.map((entry) => {
            return (
              <MachineTile
                key={getMachineKey(entry)}
                entry={entry}
                imageBaseUrl={imageBaseUrl}
                isSelected={selectedMachineKey === getMachineKey(entry)}
                onPress={() => onMachinePress(entry)}
              />
            );
          })}
        </View>
      ) : (
        <C.Typography text="No machines match your search or filters." variant="caption" />
      )}
    </View>
  );
};
