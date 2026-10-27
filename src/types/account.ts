type Login = {
    email: string;
    password: string;
};

type Machine = { name: string };

type Site = {
    name: string;
    machines: Machine[];
};

type BusinessAccount = {
    name: string;
    sites: Site[];
};

type SingleAccountInfo = {
    login: Login;
    business_accounts: BusinessAccount[];
};

export type { BusinessAccount, Login, Machine, SingleAccountInfo, Site };
