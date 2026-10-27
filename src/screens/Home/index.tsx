import { useState } from 'react';
import * as C from './../../components';
import { InvoiceHistoryModal } from './InvoiceHistoryModal';

const userName = "User";
export const Home = () => {
  const [invoicesVisible, setInvoicesVisible] = useState(false);

  return (
    <>
      <C.Container>

        <C.Box>
          <C.Typography text="Home" variant="heading" />
          <C.Typography text={`Welcome Back, ${userName}`} variant="body" />
        </C.Box>

        <C.Box title="Invoices">
          <C.Typography text="View your invoice history."/>
          <C.Buttons.Primary
            label="Show invoices"
            onPress={() => setInvoicesVisible(true)}
          />
        </C.Box>

      </C.Container>

      <InvoiceHistoryModal visible={invoicesVisible} onClose={() => setInvoicesVisible(false)} />
    </>
  );
};
