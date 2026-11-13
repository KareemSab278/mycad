import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as C from '../../components';
import { useNav } from '../../hooks/use-nav';

export const Orders = () => {
  const insets = useSafeAreaInsets();
  const nav = useNav();

  return (
    <C.Container contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingTop: insets.top + 12 }}>
      <C.Box title="Orders are unavailable">
        <C.Typography
          text="The mobile API does not currently provide order or product-catalog data."
          variant="body"
        />
        <C.Buttons.Secondary label="Go back" onPress={nav.back} />
      </C.Box>
    </C.Container>
  );
};

export default Orders;
