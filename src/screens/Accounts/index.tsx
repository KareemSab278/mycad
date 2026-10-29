/*
  users select the account they wish to use if they can otherwise just show a <C.Box> with account information.
  users can select the site info if multiple sites are available else show the site information directly in a <C.Box>

  sites show machines if multiple machines are available else show machine basic information in a <C.Box> with button to view details 

  TLDR;
  every user can have multiple accounts
  every account can have multiple sites
  every site can have multiple machines
*/

import * as C from '@/components';
import * as Ls from '@/storage';
import * as T from '@/types';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const Accounts = () => {
  const insets = useSafeAreaInsets();
  const [account, setAccount] = useState<T.SingleAccountInfo | null>(null);
  const [selectedAccountName, setSelectedAccountName] = useState('');
  const [selectedSiteName, setSelectedSiteName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const acc = await Ls.Creds.get();
        if (!acc) {
          setError('No signed-in account was found.');
          return;
        }

        const selectedAccount = acc.business_accounts[0];
        setAccount(acc);
        setSelectedAccountName(selectedAccount?.name ?? '');
        setSelectedSiteName(selectedAccount?.sites[0]?.name ?? '');
      } catch {
        setError('Unable to load account information.');
      }
    };
    fetchAccount();
  }, []);

  const selectedBusinessAccount = account?.business_accounts.find(
    (item) => item.name === selectedAccountName,
  );
  const sites = selectedBusinessAccount?.sites ?? [];
  const selectedSite = sites.find((site) => site.name === selectedSiteName) ?? sites[0];
  const selectBusinessAccount = (name: string) => {
    const nextAccount = account?.business_accounts.find((item) => item.name === name);
    setSelectedAccountName(name);
    setSelectedSiteName(nextAccount?.sites[0]?.name ?? '');
  };

  const topPadding = insets.top + (sites.length > 1 ? C.TABS_HEIGHT + C.TABS_TOP_GAP + 12 : 12);

  return (
    <C.Container contentContainerStyle={{ paddingTop: topPadding }}>
      {sites.length > 1 && (
        <C.Tabs
          items={sites.map((site) => ({ label: site.name, value: site.name }))}
          value={selectedSite?.name ?? ''}
          onValueChange={setSelectedSiteName}
        />
      )}
      <C.Box>
        <C.Typography text="Account" variant="heading" />
        {account && (
          <C.Selector
            placeholder="Select an account"
            options={account.business_accounts.map((item) => ({ label: item.name, value: item.name }))}
            value={selectedAccountName}
            onValueChange={selectBusinessAccount}
          />
        )}
      </C.Box>

      {error ? (
        <C.Alert tone="error" title="Account unavailable" message={error} />
      ) : selectedBusinessAccount ? (
        <>
          <C.Box title={selectedBusinessAccount.name}>
            <C.Typography text="Business account" variant="body" />
          </C.Box>



          {selectedSite ? (
            <C.Box title={selectedSite.name}>
              {selectedSite.machines.length === 0 ? (
                <C.Typography text="No machines are available at this site." />
              ) : (
                selectedSite.machines.map((machine) => (
                  <C.Box key={machine.name} title={machine.name}>
                    <C.Typography text="Machine information" variant="body" />
                  </C.Box>
                ))
              )}
            </C.Box>
          ) : (
            <C.Box title="Sites">
              <C.Typography text="No sites are available for this account." />
            </C.Box>
          )}
        </>
      ) : account ? (
        <C.Box title="No business accounts">
          <C.Typography text="There are no business accounts available." />
        </C.Box>
      ) : !error ? (
        <C.Loader />
      ) : null}
    </C.Container>
  );
};
