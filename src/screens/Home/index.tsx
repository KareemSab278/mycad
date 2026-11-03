import { useEffect, useState } from 'react';
import { findLoggedInCreds } from '../../helpers/security';
import * as C from './../../components';
import { useNav } from './../../helpers/navigation';
import { useAuth } from './../../hooks/auth-context';
import * as LS from './../../storage';
import { InvoiceHistoryModal } from './InvoiceHistoryModal';
import { SignOutDialog } from './components';

export const Home = () => {
  const [showSignOutAlert, setShowSignOutAlert] = useState(false);
  const [invoicesVisible, setInvoicesVisible] = useState(false);
  const [signedInEmail, setSignedInEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState(false);
  const nav = useNav();
  const { setStatus } = useAuth();

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

  const handleSignOutConfirm = async () => {
    setSigningOut(true);
    setSignOutError(false);
    try {
      await LS.Creds.clear();
      setStatus('signedOut');
      setShowSignOutAlert(false);
      setSigningOut(false);
      nav.to('/signIn');
    } catch (error) {
      console.error('Unable to sign out:', error);
      setSignOutError(true);
      setSigningOut(false);
    }
  };

  const closeSignOutDialog = () => {
    if (signingOut) return;
    setShowSignOutAlert(false);
    setSignOutError(false);
  };



  return (
    <>
      <InvoiceHistoryModal visible={invoicesVisible} onClose={() => setInvoicesVisible(false)} />

      {
        loading ? <C.Loader /> :
          <C.Container>

            <C.Box>
              <C.Typography text="Home" variant="heading" />
              <C.Typography text={`Signed in as ${signedInEmail}`} variant="title" />
              <C.Buttons.Danger
                label="Sign Out"
                onPress={() => setShowSignOutAlert(true)}
              />
            </C.Box>

            <C.Box title="Invoices">
              <C.Typography text="View your invoice history." />
              <C.Buttons.Primary
                label="Show invoices"
                onPress={() => setInvoicesVisible(true)}
              />
            </C.Box>

          </C.Container>
      }
      
      <SignOutDialog
        showSignOutAlert={showSignOutAlert}
        closeSignOutDialog={closeSignOutDialog}
        signingOut={signingOut}
        signOutError={signOutError}
        handleSignOutConfirm={handleSignOutConfirm}
      />

    </>
  );
};
