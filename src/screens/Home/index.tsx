import { useEffect, useState } from 'react';
import { findLoggedInCreds } from '../../helpers/security';
import * as C from './../../components';
import { useNav } from './../../helpers/navigation';
import { InvoiceHistoryModal } from './InvoiceHistoryModal';

export const Home = () => {
  const [invoicesVisible, setInvoicesVisible] = useState(false);
  const [signedInEmail, setSignedInEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const nav = useNav();

  const checkSignedIn = async () => {
    try {
      let tempEmail = await findLoggedInCreds();
      if (!tempEmail) nav.to('/signIn');
      else setSignedInEmail(tempEmail);
      
    } catch {
      nav.to('/signIn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(checkSignedIn);
  }, []);

  return (
    <>
      {loading ? <C.Loader /> :
        <C.Container>

          <C.Box>
            <C.Typography text="Home" variant="heading" />
            <C.Typography text={`Signed in as ${signedInEmail}`} variant="body" />
          </C.Box>

          <C.Box title="Invoices">
            <C.Typography text="View your invoice history." />
            <C.Buttons.Primary
              label="Show invoices"
              onPress={() => setInvoicesVisible(true)}
            />
          </C.Box>

        </C.Container>}

      <InvoiceHistoryModal visible={invoicesVisible} onClose={() => setInvoicesVisible(false)} />
    </>
  );
};
