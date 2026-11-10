import type { CareScheduleItem, Site } from './site';

export type BusinessAccount = {
  name: string;
  setup_required: boolean | 0 | 1;
  sites: Site[];
  careSchedule?: CareScheduleItem[];
};
