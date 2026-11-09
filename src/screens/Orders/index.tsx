import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as C from '../../components';
import { fakeProductList } from '../../fakeData';
import { useNav } from '../../helpers/navigation';
import { useTheme } from '../../hooks/use-theme';
import * as Ls from '../../storage';
import type { Product, SingleAccountInfo, SiteOrderItem } from '../../types';
import { styles } from './styles';

export const Orders = () => {
  const insets = useSafeAreaInsets();
  const nav = useNav();
  const theme = useTheme();
  const { account_name: accountNameParam, site_name: siteNameParam, machine_id: machineIdParam } =
    useLocalSearchParams<{ account_name?: string; site_name?: string; machine_id?: string }>();
  const [account, setAccount] = useState<SingleAccountInfo | null>(null);
  const [machineSelection, setMachineSelection] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [catalogVisible, setCatalogVisible] = useState(false);

  useEffect(() => {
    let active = true;

    const loadAccount = async () => {
      try {
        const savedAccount = await Ls.Creds.get();
        if (!savedAccount) {
          if (active) setError('No signed-in account was found. Sign in again to manage your order.');
          return;
        }
        if (active) setAccount(savedAccount);
      } catch (loadError) {
        console.error('Unable to load site order data:', loadError);
        if (active) setError('Unable to load your site order. Please try again later.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadAccount();
    return () => {
      active = false;
    };
  }, []);

  const businessAccount = account?.business_accounts.find((entry) => entry.name === accountNameParam);
  const site = businessAccount?.sites.find((entry) => entry.name === siteNameParam);
  const selectedMachine = site?.machines.find((machine) =>
    (machine.id ?? machine.name) === (machineSelection || machineIdParam),
  ) ?? site?.machines[0];
  const selectedMachineKey = selectedMachine?.id ?? selectedMachine?.name;
  const order = site?.next_order ?? [];

  const saveOrder = (nextOrder: SiteOrderItem[]) => {
    if (!account || !businessAccount || !site) return;

    const nextAccount: SingleAccountInfo = {
      ...account,
      business_accounts: account.business_accounts.map((entry) =>
        entry.name !== businessAccount.name ? entry : {
          ...entry,
          sites: entry.sites.map((siteEntry) =>
            siteEntry.name === site.name ? { ...siteEntry, next_order: nextOrder } : siteEntry,
          ),
        },
      ),
    };
    setAccount(nextAccount);
    void Ls.Creds.save(nextAccount);
  };

  const addProduct = (product: Product) => {
    if (!selectedMachineKey) return;

    const matchingLine = order.find((item) =>
      item.productId === product.id
      && item.machineIds.length === 1
      && item.machineIds[0] === selectedMachineKey,
    );
    if (matchingLine) {
      saveOrder(order.map((item) =>
        item === matchingLine ? { ...item, quantity: item.quantity + 1 } : item,
      ));
      return;
    }

    saveOrder([...order, { productId: product.id, machineIds: [selectedMachineKey], quantity: 1 }]);
  };

  const removeOrderItem = (itemToRemove: SiteOrderItem) => {
    saveOrder(order.filter((item) => item !== itemToRemove));
  };

  const changeQuantity = (itemToChange: SiteOrderItem, change: number) => {
    const nextQuantity = itemToChange.quantity + change;
    if (nextQuantity <= 0) {
      removeOrderItem(itemToChange);
      return;
    }
    saveOrder(order.map((item) =>
      item === itemToChange ? { ...item, quantity: nextQuantity } : item,
    ));
  };

  const machineName = (machineId: string) =>
    site?.machines.find((machine) => (machine.id ?? machine.name) === machineId)?.name ?? machineId;

  if (loading) return <C.Loader />;

  return (
    <C.Container contentContainerStyle={{ paddingTop: insets.top + 12 }}>
      <View style={styles.page}>
        <View style={styles.header}>
          <C.Typography text="Next site order" variant="heading" />
          <C.Typography
            text={businessAccount && site ? `${businessAccount.name} · ${site.name}` : 'Manage products for a machine site.'}
            variant="body"
          />
          {selectedMachine ? (
            <C.Typography text={`Selected machine: ${selectedMachine.name}`} variant="caption" />
          ) : null}
          <C.Buttons.Secondary label="Back to sites" onPress={nav.back} />
          {site && site.machines.length > 1 ? (
            <C.Selector
              label="Add new products to"
              options={site.machines.map((machine) => ({
                label: machine.name,
                value: machine.id ?? machine.name,
              }))}
              value={machineSelection || selectedMachine?.id || selectedMachine?.name}
              onValueChange={setMachineSelection}
            />
          ) : null}
        </View>

        {error ? (
          <C.Alert tone="error" title="Order unavailable" message={error} />
        ) : !businessAccount || !site ? (
          <C.Alert
            tone="error"
            title="Site unavailable"
            message="We couldn't find this site in your account. Return to Site Access Rules and open its order from a site button."
          />
        ) : (
          <>
            <C.Box
              title="Items in your next order"
              description="These products are linked to machines at this site."
            >
              <View style={styles.cardContent}>
                {order.map((item, index) => {
                  const product = fakeProductList.find((entry) => entry.id === item.productId);
                  if (!product) return null;

                  return (
                    <View key={`${item.productId}-${index}`} style={[styles.orderRow, { borderColor: theme.border }]}>
                      <View style={styles.itemDetails}>
                        <C.Typography text={product.name} variant="body" />
                        <C.Typography text={`${item.quantity} · ${product.unit}`} variant="caption" />
                        <C.Typography text={`For: ${item.machineIds.map(machineName).join(', ')}`} variant="caption" />
                      </View>
                      <View style={styles.quantityControls}>
                        <C.Buttons.Secondary label="−" onPress={() => changeQuantity(item, -1)} />
                        <C.Typography text={String(item.quantity)} variant="body" />
                        <C.Buttons.Secondary label="+" onPress={() => changeQuantity(item, 1)} />
                      </View>
                      <C.Buttons.Ghost label="Remove" onPress={() => removeOrderItem(item)} />
                    </View>
                  );
                })}
                {order.length === 0 ? (
                  <C.Typography text="Your next order is empty. Browse products to add items." variant="caption" />
                ) : null}
              </View>
            </C.Box>

            <C.Buttons.Primary
              label="Browse all products"
              onPress={() => setCatalogVisible(true)}
            />
            <C.Modal
              visible={catalogVisible}
              onClose={() => setCatalogVisible(false)}
              contentStyle={styles.catalogModal}
            >
              <C.Typography text="Product catalog" variant="title" />
              <C.Typography text="Add a refill or an extra product to this site's next order." variant="caption" />
              <ScrollView style={styles.catalogList} contentContainerStyle={styles.cardContent}>
                {fakeProductList.map((product) => (
                  <View key={product.id} style={[styles.productRow, { borderColor: theme.border }]}>
                    <View style={styles.itemDetails}>
                      <C.Typography text={product.name} variant="body" />
                      <C.Typography text={`${product.category} · ${product.unit}`} variant="caption" />
                      <C.Typography text={product.description} variant="caption" />
                    </View>
                    <C.Buttons.Secondary
                      label="Add"
                      onPress={() => addProduct(product)}
                      isDisabled={!selectedMachineKey}
                    />
                  </View>
                ))}
              </ScrollView>
              <C.Buttons.Secondary label="Done" onPress={() => setCatalogVisible(false)} />
            </C.Modal>
            <C.Typography
              text="Sample workflow only. Order changes are saved on this device and are not submitted to the supplier."
              variant="caption"
            />
          </>
        )}
      </View>
    </C.Container>
  );
};
