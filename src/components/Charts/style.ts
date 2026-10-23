import { StyleSheet } from 'react-native';

export const chartStyles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
    overflow: 'hidden',
    padding: 16,
  },
  title: {
    color: '#101828',
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    color: '#667085',
    fontSize: 13,
    lineHeight: 19,
  },
  empty: {
    color: '#667085',
    fontSize: 14,
    paddingVertical: 24,
  },
  pieLayout: {
    alignItems: 'center',
    gap: 12,
  },
  legend: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  legendDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  legendText: {
    color: '#475467',
    fontSize: 12,
  },
});