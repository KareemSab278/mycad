type Login = {
    email: string;
    password: string;
};

type Machine = { name: string };

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
};

type SingleAccountInfo = {
    login: Login;
    business_accounts: BusinessAccount[];
};

export type { BusinessAccount, ContactCategory, Login, Machine, SetupContact, SetupProfile, SetupShift, SingleAccountInfo, Site, Weekday };
