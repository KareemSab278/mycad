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

/*
    dont touch my notes or ill choose violence.
    
    this is where the site info will be held and the customer can reorder stuff, or add stuff to their monthly order.
    it is for machines so should relate to fakeAccountInfo machine data.
    a site has many machines - a user can order the machine refills for their site.

    this can be coffee beans, sugar, milk powder, chocolate powder, etc.

    it can also be machine parts for the coffee machine or drink dispenser.

    a customer usually has their account set up for what they need for their site's machines
        however, they may want to purchase extras (like a machine part or ingredients for a new item like maybe cinnamon tea for example)

        this data should be mocked as fakeProductList. then the site order table could reference parts of that order list. then the user may find the full list when trying to add an item

    they should be able to remove/add items from the next order.

    add from the fakeProductList.
    remove from the next_order
    view the full fakeProductList when adding items.
    the next_order should be linked to the site and its machines.
    we can edit fakeAccountInfo to reflect changes in the site's machine orders.
*/

import * as T from './types';

const fakeProductList: T.Product[] = [
    { id: 'coffee-beans', name: 'Coffee beans', category: 'Ingredients', unit: '1 kg bag', description: 'House blend whole coffee beans.' },
    { id: 'sugar', name: 'Granulated sugar', category: 'Ingredients', unit: '1 kg bag', description: 'Sugar for hot drinks.' },
    { id: 'milk-powder', name: 'Milk powder', category: 'Ingredients', unit: '1 kg bag', description: 'Dairy milk powder for drinks.' },
    { id: 'chocolate-powder', name: 'Drinking chocolate powder', category: 'Ingredients', unit: '1 kg bag', description: 'Chocolate powder for hot chocolate.' },
    { id: 'cinnamon-tea', name: 'Cinnamon tea', category: 'Ingredients', unit: '20 sachet box', description: 'An extra hot drink option for your machine.' },
    { id: 'cleaning-tablets', name: 'Cleaning tablets', category: 'Machine parts', unit: 'Pack', description: 'Cleaning tablets for routine machine care.' },
    { id: 'dispenser-spring', name: 'Cup dispenser spring', category: 'Machine parts', unit: 'Each', description: 'Replacement spring for a cup dispenser.' },
];

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
                    next_order: [
                        { productId: 'coffee-beans', machineIds: ['VM-1042'], quantity: 2 },
                        { productId: 'sugar', machineIds: ['VM-1042'], quantity: 1 },
                        { productId: 'cleaning-tablets', machineIds: ['VM-1042'], quantity: 1 },
                    ],
                },
                {
                    name: "Riverside Cafe",
                    machines: [fakeMachines[1], fakeMachines[3]],
                    next_order: [
                        { productId: 'coffee-beans', machineIds: ['VM-1088', 'VM-1089'], quantity: 3 },
                        { productId: 'milk-powder', machineIds: ['VM-1088'], quantity: 2 },
                    ],
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
                    next_order: [
                        { productId: 'coffee-beans', machineIds: ['VM-1120'], quantity: 2 },
                        { productId: 'chocolate-powder', machineIds: ['VM-1120'], quantity: 1 },
                    ],
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

            machines: [fakeAccountMultiple.business_accounts[0].sites[0].machines[0]],
            next_order: fakeAccountMultiple.business_accounts[0].sites[0].next_order,

        }] as T.Site[]

    }] as T.BusinessAccount[]
};

const fakeServiceRequests: T.ServiceRequest[] = [
    { id: 'SR-301', machineId: 'VM-1088', type: 'Maintenance', summary: 'Door sensor check', status: 'Scheduled', date: 'Oct 29, 2026' },
    { id: 'SR-298', machineId: 'VM-1120', type: 'Support', summary: 'Dispensing issue reported', status: 'In review', date: 'Oct 27, 2026' },
    { id: 'SR-276', machineId: 'VM-1042', type: 'Maintenance', summary: 'Routine service', status: 'Resolved', date: 'Sep 04, 2026' },
];

export { fakeAccountMultiple, fakeAccountSingle, fakeMachines, fakeProductList, fakeServiceRequests };
