import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Account } from '../../../api';
import * as C from '../../../components';
import { useTheme } from '../../../hooks/use-theme';
import type { AccountInfo, DeliveryScheduleItem } from '../../../types';
import { styles } from '../styles';

type DeliveryScheduleCardProps = {
  accounts: AccountInfo[];
  loadingAccounts: boolean;
  accountError: string;
  selectedAccountId: string;
  onAccountChange: (accountId: string) => void;
};

export const DeliveryScheduleCard = ({
  accounts,
  loadingAccounts,
  accountError,
  selectedAccountId,
  onAccountChange,
}: DeliveryScheduleCardProps) => {
  const [scheduleResult, setScheduleResult] = useState<{
    accountId: string;
    schedule: DeliveryScheduleItem[];
    error: string;
  } | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!selectedAccountId) return;

    const controller = new AbortController();
    let active = true;

    void Account.GetDeliverySchedule(selectedAccountId, controller.signal)
      .then(({ delivery_schedule }) => {
        if (active) {
          setScheduleResult({
            accountId: selectedAccountId,
            schedule: delivery_schedule,
            error: '',
          });
        }
      })
      .catch((requestError: unknown) => {
        console.error('Unable to load the delivery schedule:', requestError);
        if (active) {
          setScheduleResult({
            accountId: selectedAccountId,
            schedule: [],
            error: 'Unable to load the delivery schedule. Please try again later.',
          });
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [selectedAccountId]);

  const currentResult = scheduleResult?.accountId === selectedAccountId ? scheduleResult : null;

  return (
    <C.Card>
      <View style={styles.cardContent}>
        <C.Typography text="Delivery schedule" variant="title" />
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
        ) : null}
        {loadingAccounts ? (
          <C.Loader />
        ) : accountError ? (
          <C.Typography text={accountError} variant="caption" />
        ) : accounts.length === 0 ? (
          <C.Typography text="No linked business accounts were found." variant="caption" />
        ) : !currentResult ? (
          <C.Loader />
        ) : currentResult.error ? (
          <C.Typography text={currentResult.error} variant="caption" />
        ) : currentResult.schedule.length === 0 ? (
          <C.Typography text="No delivery schedule is available for this account." variant="caption" />
        ) : (
          currentResult.schedule.map((item, index) => {
            const upcomingDeliveries = [
              item.next_delivery_1,
              item.next_delivery_2,
              item.next_delivery_3,
            ].filter(Boolean);

            return (
              <View
                key={`${item.customer_no}:${item.contact_no}:${item.site_name}:${index}`}
                style={[styles.scheduleItem, { borderColor: theme.border }]}
              >
                <C.Typography text={item.site_name || `Route ${item.route_no}`} variant="title" />
                <C.Typography
                  text={`${item.delivery_weekday} · Every ${item.cycle_weeks} weeks`}
                  variant="body"
                />
                {upcomingDeliveries.length > 0 ? (
                  <C.Typography
                    text={`Upcoming deliveries: ${upcomingDeliveries.join(', ')}`}
                    variant="caption"
                  />
                ) : null}
              </View>
            );
          })
        )}
      </View>
    </C.Card>
  );
};

export const CareScheduleCard = () => {
  const theme = useTheme();

  return (
    <C.Card>
      <View style={styles.cardContent}>
        <C.Typography text="Customer care schedule" variant="title" />
        <View style={[styles.scheduleItem, { borderColor: theme.border }]}>
          <C.Typography text="Customer care schedule data is not available yet." variant="caption" />
        </View>
      </View>
    </C.Card>
  );
};
