import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Account } from '../../../api';
import * as C from '../../../components';
import { useTheme } from '../../../hooks/use-theme';
import type { AccountInfo, AccountMaintenanceRecord } from '../../../types';
import { styles } from '../styles';

type Props = {
  accounts: AccountInfo[];
  selectedAccountId: string;
  onAccountChange: (accountId: string) => void;
  accountError: string;
};

export const AccountMaintenanceCard = ({
  accounts,
  selectedAccountId,
  onAccountChange,
  accountError,
}: Props) => {
  const [result, setResult] = useState<{
    accountId: string;
    maintenanceRecords: AccountMaintenanceRecord[];
    error: string;
  } | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!selectedAccountId) return;

    const controller = new AbortController();
    let active = true;

    void Account.GetMaintenance(selectedAccountId, controller.signal)
      .then(({ maintenance_records }) => {
        if (active) {
          setResult({
            accountId: selectedAccountId,
            maintenanceRecords: maintenance_records,
            error: '',
          });
        }
      })
      .catch((requestError: unknown) => {
        console.error('Unable to load account maintenance history:', requestError);
        if (active) {
          setResult({
            accountId: selectedAccountId,
            maintenanceRecords: [],
            error: 'Unable to load maintenance history. Please try again later.',
          });
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [selectedAccountId]);

  const currentResult = result?.accountId === selectedAccountId ? result : null;

  return (
    <C.Box title="Latest maintenance by machine">
      {accounts.length > 1 ? (
        <C.Selector
          label="Select an account"
          options={accounts.map((account) => ({
            label: account.company_name,
            value: account.account_id,
          }))}
          value={selectedAccountId}
          onValueChange={onAccountChange}
        />
      ) : accounts[0] ? (
        <C.Typography
          text={`${accounts[0].account_id} · ${accounts[0].company_name}`}
          variant="caption"
        />
      ) : null}

      {accountError ? (
        <C.Typography text={accountError} variant="caption" />
      ) : accounts.length === 0 ? (
        <C.Typography text="No linked business accounts were found." variant="caption" />
      ) : !selectedAccountId ? (
        <C.Typography text="Select an account to see its maintenance history." variant="caption" />
      ) : !currentResult ? (
        <C.Loader />
      ) : currentResult.error ? (
        <C.Typography text={currentResult.error} variant="caption" />
      ) : currentResult.maintenanceRecords.length === 0 ? (
        <C.Typography text="No maintenance history is available for this account." variant="caption" />
      ) : (
        currentResult.maintenanceRecords.map((item) => (
          <View
            key={item.machine_id}
            style={[styles.requestRow, { borderColor: theme.border }]}
          >
            <C.Typography text={`Machine ${item.machine_id}`} variant="title" />
            <C.Typography
              text={[item.site, item.location].filter(Boolean).join(' · ') || 'Location unavailable'}
              variant="body"
            />
            <C.Typography
              text={[item.date, item.time].filter(Boolean).join(' · ') || 'Date unavailable'}
              variant="caption"
            />
          </View>
        ))
      )}
    </C.Box>
  );
};
