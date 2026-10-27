import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as C from '../../components';
import { useTheme } from '../../hooks/use-theme';
import { fakeInvoices } from './invoices';

type InvoiceHistoryModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const InvoiceHistoryModal = ({ visible, onClose }: InvoiceHistoryModalProps) => {
  const theme = useTheme();
  const [linkError, setLinkError] = useState(false);

  const close = () => {
    setLinkError(false);
    onClose();
  };

  const openInvoice = async (url: string) => {
    setLinkError(false);
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Unable to open invoice link:', error);
      setLinkError(true);
    }
  };

  return (
    <C.Modal visible={visible} onClose={close}>
      <C.Typography text="Invoice history" variant="title" />
      <C.Typography text="Sample invoices are shown below. Invoice links currently open Google." variant="caption" />
      {linkError && (
        <Text accessibilityRole="alert" style={{ color: theme.buttonDanger }}>
          Unable to open the invoice link. Please try again.
        </Text>
      )}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {fakeInvoices.map((invoice) => (
          <View key={invoice.number} style={[styles.invoice, { borderColor: theme.border }]}>
            <View style={styles.heading}>
              <C.Typography text={`Invoice ${invoice.number}`} variant="body" style={{ fontWeight: '600' }} />
              <C.Typography text={invoice.total} variant="body" style={{ fontWeight: '600' }} />
            </View>
            <View style={styles.details}>
              {[
                ['Invoice date', invoice.date],
                ['Period', invoice.period],
                ['Account', invoice.account],
                ['Order', invoice.order],
                ['Ex VAT', invoice.exVat],
                [`VAT (${invoice.vatRate})`, invoice.vat],
              ].map(([label, value]) => (
                <View key={label} style={styles.detail}>
                  <C.Typography text={label} variant="caption" />
                  <C.Typography text={value} variant="body" />
                </View>
              ))}
            </View>
            <C.LinkButton
              text="View invoice"
              onPress={() => { void openInvoice(invoice.url); }}
            />
          </View>
        ))}
      </ScrollView>
      <C.Buttons.Secondary label="Close" onPress={close} />
    </C.Modal>
  );
};

const styles = StyleSheet.create({
  list: {
    flexShrink: 1,
  },
  listContent: {
    gap: 12,
  },
  invoice: {
    borderRadius: 10,
    borderWidth: 1,
    gap: 12,
    padding: 14,
  },
  heading: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detail: {
    minWidth: '40%',
    flexGrow: 1,
  },
});
