import type { Machine } from './machines';
import type { SiteOrderItem } from './orders';

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