type Login = {
    email: string;
    password: string;
};

type Machine = { name: string };

type Site = {
    name: string;
    machines: Machine[];
};

type SetupContact = {
    name: string;
    phone: string;
    email: string;
    from: string;
    to: string;
    days: string[];
};

type SetupProfile = {
    openingDays: string[];
    businessHours: {
        shiftName: string;
        from: string;
        to: string;
    };
    siteRestrictions: Record<string, string[]>;
    allergies: string[];
    contacts: Record<'Emergency' | 'Service' | 'Accounting' | 'Other', SetupContact>;
};

type BusinessAccount = {
    name: string;
    sites: Site[];
};

type SingleAccountInfo = {
    login: Login;
    business_accounts: BusinessAccount[];
    setup_required: boolean | 0 | 1;
    setup_profile?: SetupProfile;
};

export type { BusinessAccount, Login, Machine, SetupProfile, SingleAccountInfo, Site };
