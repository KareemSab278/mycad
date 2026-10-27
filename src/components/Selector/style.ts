import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  trigger: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    minHeight: 44,
    paddingHorizontal: 16,
  },
  triggerText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  chevron: {
    fontSize: 18,
    lineHeight: 22,
  },
  list: {
    flexGrow: 0,
    flexShrink: 1,
    width: '100%',
  },
  listItem: {
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
