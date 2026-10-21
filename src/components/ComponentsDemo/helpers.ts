export const demoTabs = [
  { id: 'buttons', label: 'Buttons' },
  { id: 'forms', label: 'Forms' },
  { id: 'overlays', label: 'Overlays' },
  { id: 'display', label: 'Display' },
] as const;

export type DemoTabId = (typeof demoTabs)[number]['id'];

export const countryOptions = [
  { label: 'Canada', value: 'CA' },
  { label: 'France', value: 'FR' },
  { label: 'Japan', value: 'JP' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'United States', value: 'US' },
] as const;

export const demoTags = ['Design', 'Mobile', 'Accessibility', 'React Native'];
