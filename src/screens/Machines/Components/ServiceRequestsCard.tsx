import { View } from 'react-native';
import * as C from '../../../components';
import { styles } from '../styles';
import type { ServiceRequest } from '../../../types';

type Props = {
  machineId: string;
  requests: ServiceRequest[];
  borderColor: string;
};

export const ServiceRequestsCard = ({ machineId, requests, borderColor }: Props) => (
  <C.Box title="Service & purchase requests">
    <View style={styles.cardContent}>
      <C.Typography text={`Recent activity for machine ${machineId}`} variant="caption" />
      {requests.length ? requests.map((request) => (
        <View key={request.id} style={[styles.requestRow, { borderColor }]}>
          <View style={styles.headingText}>
            <C.Typography text={request.summary} variant="body" />
            <C.Typography text={`${request.id} · ${request.type} · ${request.date}`} variant="caption" />
          </View>
          <C.Typography text={request.status} variant="caption" />
        </View>
      )) : (
        <C.Typography text="No requests for this machine yet." variant="caption" />
      )}
    </View>
  </C.Box>
);
