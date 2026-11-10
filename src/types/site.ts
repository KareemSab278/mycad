import type { Machine } from './machines';
import type { SiteOrderItem } from './orders';
import type { Scalar } from './api';

export const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export const times = [
  'opening_time',
  'closing_time',
  'break_1_start',
  'break_1_end',
  'break_2_start',
  'break_2_end',
  'break_3_start',
  'break_3_end',
] as const;

type Day = typeof days[number];
type Time = typeof times[number];

export type RuleInput = {
  rule_type: 0 | 1 | 2 | 3;
  notes: string;
  staff_levels?: number;
  on_from_date?: string | null;
  until_date?: string | null;
  ufn?: boolean;
} & Partial<Record<Day, boolean>> & Partial<Record<Time, string | null>>;

export type Rule = {
  restriction_id: Scalar;
  account_id: string;
  version: string;
  approved: boolean;
  rule_type: Scalar;
  notes: string | null;
  staff_levels: Scalar | null;
  created: string;
  modified: string | null;
  on_from_date: string | null;
  until_date: string | null;
  ufn: Scalar | boolean | null;
} & Partial<Record<Day, Scalar | boolean | null>> & Partial<Record<Time, string | null>>;

export type CareScheduleItem = {
  milestone: string;
  date: string;
  detail: string;
};

export type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type ContactCategory = 'Emergency' | 'Service' | 'Accounting' | 'Other';

export type SetupContact = {
  name: string;
  phone: string;
  email: string;
  from: string;
  to: string;
  days: string[];
};

// A named shift with its usual opening hours, e.g. { shiftName: 'Day', from: '09:00', to: '17:00' }.
export type SetupShift = {
  shiftName: string;
  from: string;
  to: string;
};

// Per-site details collected by the setup flow.
export type SetupProfile = {
  openingDays: string[];
  businessHours: SetupShift[];
  siteRestrictions: string[];
  allergies: string[];
  contacts: Record<ContactCategory, SetupContact>;
};

export type Site = {
  name: string;
  // When omitted, the site inherits the business account's setup_required flag.
  setup_required?: boolean | 0 | 1;
  setup_profile?: SetupProfile;
  machines: Machine[];
  next_order?: SiteOrderItem[];
};