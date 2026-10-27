import { View } from 'react-native';
import * as C from '../../../components';
import { useTheme } from '../../../hooks/use-theme';
import { styles } from './styles';
import type { InformationProps } from './types';

export const OperatorInformation = ({
  information, onInformationChange, isInformationRule = false,
}: InformationProps & { isInformationRule?: boolean }) => {
  const theme = useTheme();
  const label = isInformationRule ? 'Information for Operators' : 'Additional Information';

  return (
    <View style={styles.section}>
      <C.Typography text={label} style={styles.sectionTitle} />
      <C.Typography text="Is there anything our operators need to know about visiting your site?" style={styles.description} />
      <View style={styles.fields}>
        <C.TextArea
          accessibilityLabel={label}
          value={information}
          onChangeText={onInformationChange}
          placeholder="Add any useful details..."
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
        />
      </View>
    </View>
  );
};
