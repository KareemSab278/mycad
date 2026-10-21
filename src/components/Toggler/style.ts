import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  label: {
    color: '#344054',
    fontSize: 14,
    fontWeight: '500',
  },
  track: {
    backgroundColor: '#D0D5DD',
    borderRadius: 999,
    height: 26,
    justifyContent: 'center',
    padding: 3,
    width: 46,
  },
  trackOn: {
    backgroundColor: '#208AEF',
  },
  thumb: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    height: 20,
    width: 20,
  },
  thumbOn: {
    alignSelf: 'flex-end',
  },
});
