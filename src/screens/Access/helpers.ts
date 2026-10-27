export const ruleTypes = ['Closed Dates', 'Staff Changes', 'Opening Hours', 'Information'] as const;
export type RuleType = (typeof ruleTypes)[number];

export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
export type Day = (typeof days)[number];

export type BreakPeriod = { start: string; end: string };
export type Rule = {
  id: string;
  type: RuleType;
  information: string;
  fromDate?: string;
  untilDate?: string | null;
  staffLevel?: number;
  opening?: string;
  closing?: string;
  breaks?: BreakPeriod[];
  days?: Day[];
};

export const formatDate = (date: Date) =>
  `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

export const dateValue = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const displayDate = (date: string) => {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
};

export const timeInMinutes = (time: string): number | null => {
  const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(time.trim());
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
};

export const isRuleType = (value: string): value is RuleType =>
  ruleTypes.some((type) => type === value);

export const isRule = (value: unknown): value is Rule => {
  if (typeof value !== 'object' || value === null) return false;
  const rule = value as Record<string, unknown>;
  if (typeof rule.id !== 'string' || typeof rule.type !== 'string' ||
      !isRuleType(rule.type) || typeof rule.information !== 'string') return false;
  if (rule.type === 'Information') return true;
  if (rule.type === 'Closed Dates' || rule.type === 'Staff Changes') {
    return typeof rule.fromDate === 'string' &&
      (typeof rule.untilDate === 'string' || rule.untilDate === null) &&
      (rule.type !== 'Staff Changes' || typeof rule.staffLevel === 'number');
  }
  return typeof rule.opening === 'string' && typeof rule.closing === 'string' &&
    Array.isArray(rule.days) && rule.days.every((day: unknown) =>
      typeof day === 'string' && days.some((item) => item === day)) &&
    Array.isArray(rule.breaks) && rule.breaks.every((period: unknown) => {
      if (typeof period !== 'object' || period === null) return false;
      const item = period as Record<string, unknown>;
      return typeof item.start === 'string' && typeof item.end === 'string';
    });
};
