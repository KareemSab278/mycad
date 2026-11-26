import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Account, Machine } from '../../../api';
import * as C from '../../../components';
import { useTheme } from '../../../hooks/use-theme';
import type { ServiceHistoryRecord } from '../../../types';
import { styles } from '../styles';

type Scope =
  | { type: 'account'; accountId: string }
  | { type: 'machine'; accountId: string; machineId: string };

type Props = {
  visible: boolean;
  onClose: () => void;
  scope: Scope;
};

export const ServiceHistoryModal = ({ visible, onClose, scope }: Props) => {
  const accountId = scope.accountId;
  const isMachineHistory = scope.type === 'machine';
  const machineId = isMachineHistory ? scope.machineId : '';
  const scopeKey = isMachineHistory
    ? `machine:${accountId}:${machineId}`
    : `account:${accountId}`;
  const [result, setResult] = useState<{
    scopeKey: string;
    requests: ServiceHistoryRecord[];
    error: string;
  } | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!visible || !accountId) return;

    const controller = new AbortController();
    let active = true;
    const historyRequest = isMachineHistory
      ? Machine.GetServiceRequests(machineId, { account: accountId }, controller.signal)
      : Account.GetAllServiceRequests(accountId, {}, controller.signal);

    void historyRequest
      .then(({ service_requests }) => {
        if (active) setResult({ scopeKey, requests: service_requests, error: '' });
      })
      .catch(() => {
        if (active) {
          setResult({
            scopeKey,
            requests: [],
            error: 'Unable to load service-call history. Please try again later.',
          });
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [accountId, isMachineHistory, machineId, scopeKey, visible]);

  const currentResult = result?.scopeKey === scopeKey ? result : null;

  return (
    <C.Modal visible={visible} onClose={onClose}>
      <View style={styles.modalContent}>
        <C.Typography text={`${isMachineHistory ? `Machine ` : 'Account '}service-call history`} variant="title" />
        {!accountId ? (
          <C.Typography text="No account is selected." variant="caption" />
        ) : !currentResult ? (
          <C.Loader />
        ) : currentResult.error ? (
          <C.Typography text={currentResult.error} variant="caption" />
        ) : currentResult.requests.length === 0 ? (
          <C.Typography text="No service-call history is available." variant="caption" />
        ) : (
          <ScrollView
            nestedScrollEnabled
            style={styles.serviceHistoryScroll}
            contentContainerStyle={styles.serviceHistoryContent}
          >
            {currentResult.requests.map((request) => {
              const reportedAt = [
                request.reported_date === '0' ? '' : request.reported_date,
                request.reported_time === '0' ? '' : request.reported_time,
              ].filter(Boolean).join(' | ');

              const completedAt = [
                request.closed_date === '0' ? '' : request.closed_date,
                request.closed_time === '0' ? 'Ongoing' : request.closed_time,
              ].filter(Boolean).join(' | ');

              return (
                <View
                  key={request.service_call_id}
                  style={[styles.requestRow, { borderColor: theme.border }]}
                >
                  <C.Typography text={`Machine ${request.machine_id}`} variant="title" />
                  <C.Typography text={request.summary} variant="body" />
                  <C.Typography
                    text={[
                      `Status: ${request.status}`,
                      `Service ID: ${request.service_call_id}`,
                      `Reported At: ${reportedAt || 'Date not recorded'}`,
                      request.status === 'Pending' ? null : `Closed At: ${completedAt || 'Date not recorded'}`,
                    ].filter(Boolean).join('\n\n')}
                    variant="caption"
                  />
                </View>
              );
            })}
          </ScrollView>
        )}
        <C.Buttons.Secondary label="Close" onPress={onClose} />
      </View>
    </C.Modal>
  );
};
