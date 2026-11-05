import { View } from 'react-native';
import * as C from '../../../components';
import { useTheme } from '../../../hooks/use-theme';
import { styles } from '../styles';
import type { SupportRequest } from './types';

export const SupportRequestHistoryCard = ({ requests }: { requests: SupportRequest[] }) => {
  const theme = useTheme();

  if (requests.length === 0) return null;

  return (
    <C.Card>
      <View style={styles.cardContent}>
        <C.Typography text="Your support requests" variant="title" />
        {requests.map((request) => (
          <View key={request.id} style={[styles.request, { borderColor: theme.border }]}>
            <C.Typography text={`${request.id} · ${request.date}`} variant="title" />
            <C.Typography text={request.description} variant="body" />
            <C.Typography
              text={`Email: ${request.email} · Account: ${request.accountName}${request.machineId ? ` · Machine: ${request.machineId}` : ''}`}
              variant="caption"
            />
          </View>
        ))}
      </View>
    </C.Card>
  );
};
