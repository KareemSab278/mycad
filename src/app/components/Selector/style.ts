import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  fieldGroup: {
    gap: 6,
  },
  label: {
    color: '#344054',
    fontSize: 14,
    fontWeight: '500',
  },
  trigger: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 16,
  },
  triggerText: {
    color: '#1565A8',
    fontSize: 16,
  },
  list: {
    gap: 8,
    maxHeight: '80%',
    width: '100%',
  },
  listItem: {
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  listItemSelected: {
    backgroundColor: '#E6F4FE',
  },
});
