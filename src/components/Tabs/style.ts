import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    boxSizing: 'border-box',
    maxWidth: 720,
    // paddingHorizontal: 10,
    paddingVertical: 5,
    width: '100%',
    marginTop: 30,
    top: 0,
    position: 'fixed'
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
    width: '100%',
  },
  tab: {
    alignItems: 'center',
    borderRadius: 999,
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'center',
    minHeight: 20,
    minWidth: 0,
    paddingHorizontal: 4,
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
