import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    maxWidth: 720,
    paddingHorizontal: 10,
    paddingVertical: 12,
    width: '100%',
  },
  pill: {
    backgroundColor: '#E6F4FE',
    borderRadius: 999,
    height: 40,
    overflow: 'hidden',
    padding: 0,
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  tabList: {
    alignItems: 'stretch',
    flexDirection: 'row',
    flexGrow: 1,
    gap: 4,
  },
  tab: {
    alignItems: 'center',
    borderRadius: 999,
    flexGrow: 1,
    flexShrink: 0,
    justifyContent: 'center',
    minHeight: 20,
    minWidth: 96,
    paddingHorizontal: 20,
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
