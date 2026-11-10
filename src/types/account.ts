import type { CareScheduleItem, Site } from './site';

export type AccountInfo = {
  account_id: string;
  company_name: string;
  address1: string;
  address2: string;
  town: string;
  county: string;
  postcode: string;
};

export type BusinessAccount = {
  name: string;
  setup_required: boolean | 0 | 1;
  sites: Site[];
  careSchedule?: CareScheduleItem[];
};
