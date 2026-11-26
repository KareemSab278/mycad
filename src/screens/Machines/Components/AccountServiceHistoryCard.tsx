import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Account } from '../../../api';
import * as C from '../../../components';
import { useTheme } from '../../../hooks/use-theme';
import type { ServiceHistoryRecord } from '../../../types';
import { styles } from '../styles';

type Props = {
  accountId: string;
  accountError: string;
};

export const AccountServiceHistoryCard = ({ accountId, accountError }: Props) => {
  const [result, setResult] = useState<{
    accountId: string;
    requests: ServiceHistoryRecord[];
    error: string;
  } | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!accountId) return;

    const controller = new AbortController();
    let active = true;

    void Account.GetAllServiceRequests(accountId, {}, controller.signal)
      .then(({ service_requests }) => {
        if (active) setResult({ accountId, requests: service_requests, error: '' });
      })
      .catch(() => {
        if (active) {
          setResult({
            accountId,
            requests: [],
            error: 'Unable to load service-call history. Please try again later.',
          });
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [accountId]);

  const currentResult = result?.accountId === accountId ? result : null;

  return (
    <C.Box title="Service call history">
      {accountError ? (
        <C.Typography text={accountError} variant="caption" />
      ) : !accountId ? (
        <C.Typography text="Select an account to see its service-call history." variant="caption" />
      ) : !currentResult ? (
        <C.Loader />
      ) : currentResult.error ? (
        <C.Typography text={currentResult.error} variant="caption" />
      ) : currentResult.requests.length === 0 ? (
        <C.Typography text="No service-call history is available for this account." variant="caption" />
      ) : (
        currentResult.requests.map((request) => {
          const reportedAt = [
            request.reported_date === '0' ? '' : request.reported_date,
            request.reported_time === '0' ? '' : request.reported_time,
          ].filter(Boolean).join(' · ');

          return (
            <View
              key={request.service_call_id}
              style={[styles.requestRow, { borderColor: theme.border }]}
            >
              <C.Typography
                text={`Machine ${request.machine_id} · ${request.call_type}`}
                variant="title"
              />
              <C.Typography text={request.summary} variant="body" />
              <C.Typography
                text={[
                  request.service_call_id,
                  reportedAt || 'Date not recorded',
                  request.status,
                ].join(' · ')}
                variant="caption"
              />
            </View>
          );
        })
      )}
      {!accountError && accountId ? (
        <C.Typography
          text="This history does not include pending support submissions."
          variant="caption"
        />
      ) : null}
    </C.Box>
  );
};
