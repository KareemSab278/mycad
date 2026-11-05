type Login = {
    email: string;
    password: string;
};

type Machine = { name: string };

type MachineStatus = 'Online' | 'Service pending' | 'Issue reported' | 'Last serviced';

type MachineRecord = Machine & {
    id: string;
    account: string;
    model: string;
    arrangement: string;
    status: MachineStatus;
    nextDelivery: string;
    lastServiced: string;
};

type ServiceRequest = {
    id: string;
    machineId: string;
    type: 'Maintenance' | 'Support' | 'Refund';
    summary: string;
    status: 'In review' | 'Scheduled' | 'Resolved';
    date: string;
};

type CareScheduleItem = {
    milestone: string;
    date: string;
    detail: string;
};

type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

type ContactCategory = 'Emergency' | 'Service' | 'Accounting' | 'Other';

type SetupContact = {
    name: string;
    phone: string;
    email: string;
    from: string;
    to: string;
    days: string[];
};

// A named shift with its usual opening hours, e.g. { shiftName: 'Day', from: '09:00', to: '17:00' }.
type SetupShift = {
    shiftName: string;
    from: string;
    to: string;
};

// Per-site details collected by the setup flow.
type SetupProfile = {
    openingDays: string[];
    businessHours: SetupShift[];
    siteRestrictions: string[];
    allergies: string[];
    contacts: Record<ContactCategory, SetupContact>;
};

type Site = {
    name: string;
    // When omitted, the site inherits the business account's setup_required flag.
    setup_required?: boolean | 0 | 1;
    setup_profile?: SetupProfile;
    machines: Machine[];
};

type BusinessAccount = {
    name: string;
    setup_required: boolean | 0 | 1;
    sites: Site[];
    careSchedule?: CareScheduleItem[];
};

type SingleAccountInfo = {
    login: Login;
    business_accounts: BusinessAccount[];
};

export type {
    BusinessAccount,
    CareScheduleItem,
    ContactCategory,
    Login,
    Machine,
    MachineRecord,
    MachineStatus,
    ServiceRequest,
    SetupContact,
    SetupProfile,
    SetupShift,
    SingleAccountInfo,
    Site,
    Weekday,
};
