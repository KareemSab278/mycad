import { useEffect, useState } from 'react';
import * as LS from '../../storage';
import * as C from './../../components';
import { useNav } from './../../helpers/navigation';
import { InvoiceHistoryModal } from './InvoiceHistoryModal';

const checkUserSignedIn = async () => {
  const user = await LS.Account.get();
  return user && user.login.email && user.login.email.trim() !== '';
};


export const Home = () => {
  const [invoicesVisible, setInvoicesVisible] = useState(false);
  const [signedInEmail, setSignedInEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const nav = useNav();

  const checkSignedIn = async () => {
    try {
      const user = await LS.Account.get();
      let email = user?.login?.email?.trim() ?? '';

      nav.from<{ email?: string }>((params) => {
        if (params.email?.trim()) {
          email = params.email.trim();
        }
      });

      if (!email) {
        nav.to('/signIn');
        return;
      }

      setSignedInEmail(email);
    } catch (error) {
      nav.to('/signIn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSignedIn();
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
