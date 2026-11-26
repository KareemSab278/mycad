import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Account } from '../../../api';
import * as C from '../../../components';
import { useTheme } from '../../../hooks/use-theme';
import type { DeliveryScheduleOrder, DeliveryScheduleResponse } from '../../../types';
import { styles } from '../styles';

const formatOrderDate = (yymmdd: number | null) => {
  if (yymmdd === null) return 'Not scheduled';
  const date = String(yymmdd).padStart(6, '0');
  return `${date.slice(4, 6)}/${date.slice(2, 4)}/${date.slice(0, 2)}`;
};


type DeliveryScheduleModalProps = {
  accountId: string;
  visible: boolean;
  onClose: () => void;
};


const getDeliverySchedule = async (accountId: string, controller: AbortController, onFound: (res: DeliveryScheduleResponse) => void): Promise<DeliveryScheduleResponse> => {
  const res = await Account.GetDeliverySchedule(accountId, controller.signal);
  onFound(res);
  return res;
}


export const DeliveryScheduleModal = ({
  accountId,
  visible,
  onClose,
}: DeliveryScheduleModalProps) => {
  const [result, setResult] = useState<{
    accountId: string;
    schedule: DeliveryScheduleOrder[];
    error: string;
  } | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!visible || !accountId) return;

    const controller = new AbortController();
    let active = true;

    getDeliverySchedule(accountId, controller, (res) => {
      if (active) {
        console.log('Delivery schedule fetched for account:', accountId, res);
        setResult({ accountId, schedule: res.delivery_schedule, error: '' });
      }
    }).catch((error) => {
      console.error('Failed to fetch delivery schedule for account:', accountId, error);
      if (active) setResult({ accountId, schedule: [], error: (error as Error).message });
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
          <C.Typography text="No recent orders were found for this account." variant="caption" />
        ) : (
          <ScrollView
            nestedScrollEnabled
            style={styles.deliveryScheduleScroll}
            contentContainerStyle={styles.deliveryScheduleContent}
          >
            {currentResult.schedule.map(({ header, items }) => {
              const deliveredDate = header.delivered_yymmdd === null
                ? null
                : formatOrderDate(header.delivered_yymmdd);
              return (
                <View
                  key={header.order_no}
                  style={[styles.scheduleItem, { borderColor: theme.border }]}
                >
                  <C.Typography text={`Order ${header.order_no}`} variant="title" />
                  <C.Typography
                    text={`Scheduled ${formatOrderDate(header.scheduled_yymmdd)} · Route ${header.route_no}`}
                    variant="body"
                  />
                  {deliveredDate ? (
                    <C.Typography text={`Delivered ${deliveredDate}`} variant="caption" />
                  ) : null}
                  <C.Typography
                    text={`${header.status_code} · ${header.qty_ordered} items · £${header.order_value.toFixed(2)}`}
                    variant="caption"
                  />
                  {items.map((item, index) => (
                    <C.Typography
                      key={`${item.product_no}:${index}`}
                      text={`${item.description} · ${item.qty_ordered} × £${item.unit_price.toFixed(2)}`}
                      variant="caption"
                    />
                  ))}
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
