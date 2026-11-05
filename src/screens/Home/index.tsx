import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNav } from '../../helpers/navigation';
import { useAuth } from '../../hooks/auth-context';
import * as LS from '../../storage';
import type { SingleAccountInfo } from '../../types';
import * as C from './../../components';
import { MachineList } from './components';

type HomeProps = {
  onEditSetup?: () => void;
};

export const Home = ({ onEditSetup }: HomeProps) => {
  const insets = useSafeAreaInsets();
  const [account, setAccount] = useState<SingleAccountInfo | null>(null);
  const [selectedAccountName, setSelectedAccountName] = useState('');
  const [loading, setLoading] = useState(true);
  const [accountError, setAccountError] = useState('');
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState(false);
  const router = useRouter();
  const nav = useNav();
  const { setStatus } = useAuth();

  useEffect(() => {
    let active = true;

    const loadAccount = async () => {
      try {
        const credentials = await LS.Creds.get();
        if (!credentials) {
          router.replace('/signIn');
          return;
        }

        if (active) {
          const firstAccount = credentials.business_accounts[0];
          setAccount(credentials);
          setSelectedAccountName(firstAccount?.name ?? '');
        }
      } catch (error) {
        console.error('Unable to load home account information:', error);
        if (active) setAccountError('Unable to load your account information. Please try again later.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadAccount();
    return () => {
      active = false;
    };
  }, [router]);

  const selectedBusinessAccount = account?.business_accounts.find(
    (item) => item.name === selectedAccountName,
  );
  const selectBusinessAccount = (name: string) => {
    setSelectedAccountName(name);
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    setSignOutError(false);
    try {
      await LS.Creds.clear();
      setStatus('signedOut');
      setSigningOut(false);
      router.replace('/signIn');
    } catch (error) {
      console.error('Unable to sign out:', error);
      setSignOutError(true);
      setSigningOut(false);
    }
  };

  const topPadding = insets.top + 12;

  if (loading) return <C.Loader />;

  return (
    <View style={styles.screen}>
      <C.Container contentContainerStyle={{ paddingTop: topPadding, paddingBottom: 76 }}>
        <C.Typography text="Home" variant="heading" />

        {accountError ? (
          <C.Alert tone="error" title="Account unavailable" message={accountError} />
        ) : selectedBusinessAccount ? (
          <>
            <C.Box title={account && account.business_accounts.length > 1 ? "Your accounts" : "Your account"}>
              {account && account.business_accounts.length > 1 ? (
                <C.Selector
                  placeholder="Select an account"
                  options={account.business_accounts.map((item) => ({ label: item.name, value: item.name }))}
                  value={selectedAccountName}
                  onValueChange={selectBusinessAccount}
                />
              ) : null}
              {onEditSetup ? (
                <C.Buttons.Secondary label="Edit business setup" onPress={onEditSetup} />
              ) : null}
            </C.Box>

            <C.Box title="Customer care schedule" description="Planned check-ins for this account">
              {selectedBusinessAccount.careSchedule?.length ? (
                selectedBusinessAccount.careSchedule.map((item) => (
                  <View key={`${item.milestone}-${item.date}`} style={{ gap: 4 }}>
                    <C.Typography text={`${item.milestone} · ${item.date}`} variant="body" />
                    <C.Typography text={item.detail} variant="caption" />
                  </View>
                ))
              ) : (
                <C.Typography text="No customer care check-ins are scheduled for this account." variant="caption" />
              )}
            </C.Box>

            <MachineList selectedBusinessAccount={selectedBusinessAccount} />
          </>
        ) : account ? (
          <C.Box title="No business accounts">
            <C.Typography text="There are no business accounts available." variant="body" />
          </C.Box>
        ) : null}
      </C.Container>
      <View pointerEvents="box-none" style={styles.userButton}>
        <C.UserModal
          email={account?.login.email ?? ''}
          accountName={selectedBusinessAccount?.name}
          signingOut={signingOut}
          signOutError={signOutError}
          onSignOut={() => { void handleSignOut(); }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  userButton: {
    bottom: 16,
    position: 'absolute',
    right: 16,
    zIndex: 1,
  },
});
