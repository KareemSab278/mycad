import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Account, Auth, Machine, User } from '../../api';
import { useAuth } from '../../hooks/auth-context';
import type { AccountInfo, LinkedMachine, Profile } from '../../types';
import * as C from './../../components';

type HomeProps = {
  // leave just incase theres alerts for the machine info or anything for now
  onOpenMachine?: (accountId: string, machineId: string) => void;
};

export const Home = ({ onOpenMachine }: HomeProps) => {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [machineResult, setMachineResult] = useState<{
    accountId: string;
    machines: LinkedMachine[];
    error: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountError, setAccountError] = useState('');
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState(false);
  const router = useRouter();
  const { setStatus } = useAuth();
  const nav = useRouter();

  useEffect(() => {
    let active = true;

    const loadHome = async () => {
      try {
        const [user, linkedAccounts] = await Promise.all([
          User.GetInfo(),
          Account.GetAll(),
        ]);
        if (active) {
          setProfile(user);
          setAccounts(linkedAccounts);
          setSelectedAccountId(linkedAccounts[0]?.account_id ?? '');
        }
      } catch (error) {
        console.error('Unable to load home account information:', error);
        if (active) setAccountError('Unable to load your account information. Please try again later.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadHome();
    return () => {
      active = false;
    };
  }, []);

  const selectedAccount = accounts.find((account) => account.account_id === selectedAccountId);
  const selectedMachineResult = machineResult?.accountId === selectedAccountId ? machineResult : null;

  useEffect(() => {
    if (!selectedAccount) return;

    let active = true;
    void Machine.GetAllForAccounts([selectedAccount])
      .then((linkedMachines) => {
        if (active) {
          setMachineResult({
            accountId: selectedAccount.account_id,
            machines: linkedMachines,
            error: '',
          });
        }
      })
      .catch((error: unknown) => {
        console.error('Unable to load installed machines:', error);
        if (active) {
          setMachineResult({
            accountId: selectedAccount.account_id,
            machines: [],
            error: 'Unable to load machines for this account. Please try again later.',
          });
        }
      });

    return () => {
      active = false;
    };
  }, [selectedAccount]);

  const handleSignOut = async () => {
    setSigningOut(true);
    setSignOutError(false);
    try {
      const loggedOut = await Auth.LogOut().then(() => true).catch(() => false);

      if (loggedOut) {
        setStatus('signedOut');
        nav.replace('/signIn');
      } else {
        setSignOutError(true);
        console.error('Sign out failed');
      }

    } catch (error) {
      console.error('Unable to sign out:', error);
      setSignOutError(true);
    } finally {
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
        ) : accounts.length === 0 ? (
          <C.Box title="No linked accounts">
            <C.Typography text="There are no business accounts linked to this user." variant="body" />
          </C.Box>
        ) : selectedAccount ? (
          <>
            <C.Box title={accounts.length > 1 ? 'Your accounts' : 'Your account'}>
              {accounts.length > 1 ? (
                <C.Selector
                  placeholder="Select an account"
                  options={accounts.map((account) => ({
                    label: account.company_name,
                    value: account.account_id,
                  }))}
                  value={selectedAccountId}
                  onValueChange={setSelectedAccountId}
                />
              ) : null}
              <C.Typography text={`${selectedAccount.account_id} - ${selectedAccount.company_name}`} variant="title" />
              <C.Typography
                text={[
                  selectedAccount.address1.trim(),
                  selectedAccount.address2.trim(),
                  selectedAccount.town.trim(),
                  selectedAccount.county.trim(),
                  selectedAccount.postcode.trim(),
                ].filter(Boolean).join(', ')}
                variant="caption"
              />
            </C.Box>
          </>
        ) : null}

        {/* 
        thinking of putting any alerts for the account here, such as errors or notifications related to the selected account.
        or show the upcoming service notifications, or when maintenance is required for the machines linked to the account.
        or if there are any critical alerts related to the account or its linked machines.
        or if support has completed any actions related to the account or its linked machines.
        show next delivery for account and have btn to open the screen to view details or edit the delivery.
        etc. for now ill show no actions for your account right now
      */}

        <C.Box title="Upcoming alerts">
          <C.Typography text="Seems like there are no upcoming alerts for your account." variant="body" />
        </C.Box>
      </C.Container>

      {/* show links here to different pages - kinda like a main menu
      
        - what would you like to do today? 
          - edit my next delivery
          - view upcoming service notifications
          - check critical alerts for my account
          - view support actions related to my account
          - view all account machines
          - edit site access settings

      they go to specific pages from here using the navigation helper.
      */}





      <View pointerEvents="box-none" style={styles.userButton}>
        <C.UserModal
          email={profile?.email ?? ''}
          accountNames={accounts.map(account => account.company_name)}
          signingOut={signingOut}
          signOutError={signOutError}
          onSignOut={async () => { await handleSignOut(); }}
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
