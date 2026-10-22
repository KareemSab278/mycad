import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  trigger: {
    alignSelf: 'flex-start',
  },
  list: {
    gap: 8,
    maxHeight: '80%',
    minHeight: 0,
    width: '100%',
  },
  listItem: {
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
