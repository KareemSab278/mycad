import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    left: 12,
    position: 'absolute',
    right: 12,
  },
  container: {
    boxSizing: 'border-box',
    maxWidth: 720,
    paddingHorizontal: 10,
    paddingVertical: 2,
    width: '100%',
  },
  pill: {
    borderRadius: 999,
    height: 50,
    overflow: 'hidden',
    padding: 5,
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  tabList: {
    alignItems: 'stretch',
    flexDirection: 'row',
    gap: 4,
    width: 'max-content',
  },
  tab: {
    alignItems: 'center',
    borderRadius: 999,
    justifyContent: 'center',
    minHeight: 20,
    minWidth: 50,
    paddingHorizontal: 12,
    flexShrink: 0,
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