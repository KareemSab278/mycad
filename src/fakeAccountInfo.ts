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

const fakeCareSchedule: T.CareScheduleItem[] = [
    { milestone: '3-month check-in', date: 'Dec 2026', detail: 'Review machine performance and answer questions.' },
    { milestone: '4-month follow-up', date: 'Jan 2027', detail: 'Check stock levels and discuss any service needs.' },
    { milestone: '6-month review', date: 'Mar 2027', detail: 'Routine account and machine health review.' },
];

const fakeMachines: T.MachineRecord[] = [
    {
        id: 'VM-1042',
        name: 'Downtown Market Machine',
        account: 'Northside Foods',
        model: 'Vend Mini 2',
        arrangement: 'Wholesale',
        status: 'Online',
        nextDelivery: 'Nov 12, 2026',
        lastServiced: 'Sep 04, 2026',
    },
    {
        id: 'VM-1088',
        name: 'Riverside Cafe Machine',
        account: 'Riverside Hospitality',
        model: 'Vend Mini 2',
        arrangement: 'Rental',
        status: 'Service pending',
        nextDelivery: 'Nov 19, 2026',
        lastServiced: 'Aug 22, 2026',
    },
    {
        id: 'VM-1120',
        name: 'Eastside Offices Machine',
        account: 'Eastside Group',
        model: 'Vend Mini',
        arrangement: 'Wholesale',
        status: 'Issue reported',
        nextDelivery: 'Nov 24, 2026',
        lastServiced: 'Oct 12, 2026',
    },
    {
        id: 'VM-1089',
        name: 'Riverside Cafe Machine 2',
        account: 'Riverside Hospitality',
        model: 'Vend Mini',
        arrangement: 'Rental',
        status: 'Online',
        nextDelivery: 'Nov 26, 2026',
        lastServiced: 'Oct 02, 2026',
    },
];

const fakeAccountMultiple: T.SingleAccountInfo =
{
    login: {
        email: "user1@example.com",
        password: "password123"
    } as T.Login,
    business_accounts: [
        {
            name: "Northside Foods",
            setup_required: true,
            careSchedule: fakeCareSchedule,
            sites: [
                {
                    name: "Downtown Market",
                    machines: [fakeMachines[0]],
                },
                {
                    name: "Riverside Cafe",
                    machines: [fakeMachines[1], fakeMachines[3]],
                }
            ] as T.Site[]
        } as T.BusinessAccount,
        {
            name: "Eastside Group",
            setup_required: false,
            sites: [
                {
                    name: "Eastside Offices",
                    setup_required: true,
                    machines: [fakeMachines[2]],
                }
            ] as T.Site[]
        } as T.BusinessAccount
    ] as T.BusinessAccount[]
};

const fakeAccountSingle: T.SingleAccountInfo = {
    login: fakeAccountMultiple.login as T.Login,

    business_accounts: [{
        name: fakeAccountMultiple.business_accounts[0].name,
        setup_required: fakeAccountMultiple.business_accounts[0].setup_required,
        careSchedule: fakeAccountMultiple.business_accounts[0].careSchedule,

        sites: [{
            name: fakeAccountMultiple.business_accounts[0].sites[0].name,
            setup_required: fakeAccountMultiple.business_accounts[0].sites[0].setup_required,

            machines: [fakeAccountMultiple.business_accounts[0].sites[0].machines[0]]

        }] as T.Site[]

    }] as T.BusinessAccount[]
};

const fakeServiceRequests: T.ServiceRequest[] = [
    { id: 'SR-301', machineId: 'VM-1088', type: 'Maintenance', summary: 'Door sensor check', status: 'Scheduled', date: 'Oct 29, 2026' },
    { id: 'SR-298', machineId: 'VM-1120', type: 'Support', summary: 'Dispensing issue reported', status: 'In review', date: 'Oct 27, 2026' },
    { id: 'SR-276', machineId: 'VM-1042', type: 'Maintenance', summary: 'Routine service', status: 'Resolved', date: 'Sep 04, 2026' },
];

export { fakeAccountMultiple, fakeAccountSingle, fakeMachines, fakeServiceRequests };
