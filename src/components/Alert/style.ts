import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    borderLeftWidth: 4,
    borderRadius: 8,
    gap: 4,
    padding: 12,
  },
  info: {
    backgroundColor: '#EFF8FF',
    borderLeftColor: '#2E90FA',
  },
  success: {
    backgroundColor: '#ECFDF3',
    borderLeftColor: '#12B76A',
  },
  warning: {
    backgroundColor: '#FFFAEB',
    borderLeftColor: '#F79009',
  },
  error: {
    backgroundColor: '#FEF3F2',
    borderLeftColor: '#F04438',
  },
  title: {
    color: '#344054',
    fontSize: 14,
    fontWeight: '500',
  },
});
