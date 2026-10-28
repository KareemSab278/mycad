import { useEffect, useState } from 'react';
import * as C from './../../components';
import { useNav } from './../../helpers/navigation';
import { InvoiceHistoryModal } from './InvoiceHistoryModal';

export const Home = () => {
  const [invoicesVisible, setInvoicesVisible] = useState(false);
  const [signedInEmail, setSignedInEmail] = useState('');
  const nav = useNav();


  useEffect(() => {
    nav.from<{ email?: string }>((params) => {
      if (params.email && params.email?.trim() !== '') {
        setSignedInEmail(params.email);
      } else {
        nav.to('/signIn');
      }
    });

  }, []);

  return (
    <>
      <C.Container>

        <C.Box>
          <C.Typography text="Home" variant="heading" />
          <C.Typography text={`Welcome Back, ${signedInEmail}`} variant="body" />
        </C.Box>

        <C.Box title="Invoices">
          <C.Typography text="View your invoice history." />
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
