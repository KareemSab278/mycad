import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  calendar: {
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    padding: 14,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthButton: {
    alignItems: 'center',
    borderRadius: 999,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  monthButtonLabel: {
    fontSize: 24,
    lineHeight: 28,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  weekRow: {
    flexDirection: 'row',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  weekDay: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    paddingVertical: 8,
    textAlign: 'center',
  },
  dayCell: {
    alignItems: 'center',
    borderRadius: 999,
    height: 40,
    justifyContent: 'center',
    width: `${100 / 7}%`,
  },
  dayLabel: {
    fontSize: 14,
  },
  dayIndicator: {
    alignItems: 'center',
    borderRadius: 999,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  disabledDay: {
    opacity: 0.4,
  },
});
