import { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import * as C from '../../../components';
import { useTheme } from '../../../hooks/use-theme';
import { styles } from '../styles';
import { getMachineKey, type AccountMachine } from './types';

type Props = {
  machines: AccountMachine[];
  onMachinePress: (entry: AccountMachine) => void;
  selectedMachineKey?: string;
};

export const MachineGrid = ({
  machines,
  onMachinePress,
  selectedMachineKey,
}: Props) => {
  const theme = useTheme();
  const [machineSearch, setMachineSearch] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const showFilters = machines.length > 5;
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

    return matchesModel && searchableText.includes(machineSearch.trim().toLowerCase());
  });

  return (
    <View style={styles.machineGridContainer}>
      {showFilters ? (
        <>
          <C.SearchField
            placeholder="Search machines"
            value={machineSearch}
            onChangeText={setMachineSearch}
          />
          <C.Selector
            label="Filter by model"
            placeholder="All models"
            options={[
              { label: 'All models', value: '' },
              ...modelFilters.map((model) => ({ label: `Model: ${model}`, value: model })),
            ]}
            value={selectedModel}
            onValueChange={setSelectedModel}
          />
        </>
      ) : null}

      {visibleMachines.length > 0 ? (
        <View style={styles.machineGrid}>
          {visibleMachines.map((entry) => {
            const machine = entry.machine;
            const machineName = `Machine ${machine.machine_id}`;
            const location = machine.location.trim() || 'Location unavailable';
            const imageBaseUrl = process.env.EXPO_PUBLIC_MACHINE_IMAGE_URL?.replace(/\/+$/, '');
            const imageModel = machine.root_model || 0;
            const imageUrl = imageBaseUrl
              ? `${imageBaseUrl}/${encodeURIComponent(imageModel)}.png`
              : undefined;
            const isSelected = selectedMachineKey === getMachineKey(entry);

            const [imageSource, setImageSource] = useState(imageUrl);


            return (
              <Pressable
                key={getMachineKey(entry)}
                accessibilityRole="button"
                accessibilityLabel={`${machineName}, ${location}`}
                accessibilityState={{ selected: isSelected }}
                onPress={() => onMachinePress(entry)}
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
          })}
        </View>
      ) : (
        <C.Typography text="No machines match your search or filters." variant="caption" />
      )}
    </View>
  );
};
