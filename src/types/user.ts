import type { BusinessAccount } from './account';

export type Login = {
  email: string;
  password: string;
};

export type SingleAccountInfo = {
  login: Login;
  business_accounts: BusinessAccount[];
};
