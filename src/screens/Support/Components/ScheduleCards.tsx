import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Account } from '../../../api';
import * as C from '../../../components';
import { useTheme } from '../../../hooks/use-theme';
import type { DeliveryScheduleItem } from '../../../types';
import { styles } from '../styles';

type DeliveryScheduleModalProps = {
  accountId: string;
  visible: boolean;
  onClose: () => void;
};

export const DeliveryScheduleModal = ({
  accountId,
  visible,
  onClose,
}: DeliveryScheduleModalProps) => {
  const [result, setResult] = useState<{
    accountId: string;
    schedule: DeliveryScheduleItem[];
    error: string;
  } | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!visible || !accountId) return;

    const controller = new AbortController();
    let active = true;

    void Account.GetDeliverySchedule(accountId, controller.signal)
      .then(({ delivery_schedule }) => {
        if (active) {
          setResult({
            accountId,
            schedule: delivery_schedule,
            error: '',
          });
        }
      })
      .catch((requestError: unknown) => {
        console.error('Unable to load the delivery schedule:', requestError);
        if (active) {
          setResult({
            accountId,
            schedule: [],
            error: 'Unable to load the delivery schedule. Please try again later.',
          });
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [accountId, visible]);

  const currentResult = result?.accountId === accountId ? result : null;

  return (
    <C.Modal visible={visible} onClose={onClose}>
      <View style={styles.modalContent}>
        <C.Typography text="Delivery schedule" variant="title" />
        {!accountId ? (
          <C.Typography text="Select an account to see its delivery schedule." variant="caption" />
        ) : !currentResult ? (
          <C.Loader />
        ) : currentResult.error ? (
          <C.Typography text={currentResult.error} variant="caption" />
        ) : currentResult.schedule.length === 0 ? (
          <C.Typography text="No delivery schedule is available for this account." variant="caption" />
        ) : (
          <ScrollView
            nestedScrollEnabled
            style={styles.deliveryScheduleScroll}
            contentContainerStyle={styles.deliveryScheduleContent}
          >
            {currentResult.schedule.map((item, index) => {
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
            })}
          </ScrollView>
        )}
        <C.Buttons.Secondary label="Close" onPress={onClose} />
      </View>
    </C.Modal>
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
