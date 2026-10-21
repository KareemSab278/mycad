import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  box: {
    alignItems: 'center',
    borderColor: '#98A2B3',
    borderRadius: 4,
    borderWidth: 1,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  boxChecked: {
    backgroundColor: '#208AEF',
    borderColor: '#208AEF',
  },
  mark: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  label: {
    color: '#344054',
    fontSize: 14,
    fontWeight: '500',
  },
});
