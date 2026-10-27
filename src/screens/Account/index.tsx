/*
  users select the account they wish to use if they can otherwise just show a <C.Box> with account information.
  users can select the site info if multiple sites are available else show the site information directly in a <C.Box>

  sites show machines if multiple machines are available else show machine basic information in a <C.Box> with button to view details 

*/

import * as C from '@/components';
import * as Ls from '@/storage';
import * as T from '@/types';
import { useEffect, useState } from 'react';

export const Account = () => {

  const [account, setAccount] = useState<T.SingleAccountInfo[] | null>(null);

  useEffect(() => {
    const fetchAccount = async () => {
      const acc = await Ls.Account.get();
      setAccount(acc);
    };
    fetchAccount();
  }, []);

  return (
    <C.Container>
      <C.Box title='Account'>
        <C.Typography text="This is a simple placeholder screen." variant="body" />
      </C.Box>
    </C.Container>
  );
};
