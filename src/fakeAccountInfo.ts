/*
  This file contains fake account information for testing purposes.

  user signs in with email and password

  they then get multiple business accounts under that user account email

  every email can have multiple business accounts associated with it.
  every business account has multiple sites associated with it.
  every site has multiple machines associated with it.

  the user is meant to select the account from Home after signing in
    then if that account has multiple sites from tabs component in Account screen, they select the site
        then if the site has multiple machines, they select the machine to show its information.
*/

import * as T from './types';
const fakeAccountMultiple: T.SingleAccountInfo =
{
    login: {
        email: "user1@example.com",
        password: "password123"
    } as T.Login,
    business_accounts: [
        {
            name: "Business Account 1",
            sites: [
                {
                    name: "Site 1",
                    machines: [
                        { name: "Machine 1" },
                        { name: "Machine 2" }
                    ]
                },
                {
                    name: "Site 2",
                    machines: [
                        { name: "Machine 3" },
                        { name: "Machine 4" }
                    ]
                }
            ] as T.Site[]
        } as T.BusinessAccount,
        {
            name: "Business Account 2",
            sites: [
                {
                    name: "Site 3",
                    machines: [
                        { name: "Machine 5" },
                        { name: "Machine 6" }
                    ]
                }
            ] as T.Site[]
        } as T.BusinessAccount
    ] as T.BusinessAccount[]
};

const fakeAccountSingle: T.SingleAccountInfo = {
    login: fakeAccountMultiple.login as T.Login,

    business_accounts: [{
        name: fakeAccountMultiple.business_accounts[0].name,

        sites: [{
            name: fakeAccountMultiple.business_accounts[0].sites[0].name,

            machines: [{
                name: fakeAccountMultiple.business_accounts[0].sites[0].machines[0].name
            }] as T.Machine[]

        }] as T.Site[]

    }] as T.BusinessAccount[]
};

export { fakeAccountMultiple, fakeAccountSingle };

