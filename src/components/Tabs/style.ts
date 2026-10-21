import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  tabList: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  tab: {
    alignItems: 'center',
    backgroundColor: '#F2F4F7',
    borderRadius: 999,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 16,
  },
  selectedTab: {
    backgroundColor: '#208AEF',
  },
  label: {
    color: '#344054',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedLabel: {
    color: '#FFFFFF',
  },
});
