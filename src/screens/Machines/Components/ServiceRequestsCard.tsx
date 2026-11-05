import { View } from 'react-native';
import * as C from '../../../components';
import { styles } from '../styles';
import type { ServiceRequest } from '../../../types';

type Props = {
  machineId: string | undefined;
  requests: ServiceRequest[];
  borderColor: string;
};

export const ServiceRequestsCard = ({ machineId, requests, borderColor }: Props) => (
  <C.Card>
    <View style={styles.cardContent}>
      <View style={styles.sectionHeading}>
        <View style={styles.headingText}>
          <C.Typography text="Service & purchase requests" variant="title" />
          <C.Typography text={`Recent activity for ${machineId}`} variant="caption" />
        </View>
        <C.Typography text={`${requests.length} requests`} variant="caption" />
      </View>

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
  </C.Card>
);
