import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  calendar: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EAECF0',
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
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
    color: '#344054',
    fontSize: 24,
  },
  monthLabel: {
    color: '#101828',
    fontSize: 16,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  weekDay: {
    color: '#667085',
    fontSize: 12,
    fontWeight: '500',
    paddingVertical: 8,
    textAlign: 'center',
    width: `${100 / 7}%`,
  },
  dayCell: {
    alignItems: 'center',
    borderRadius: 999,
    height: 40,
    justifyContent: 'center',
    width: `${100 / 7}%`,
  },
  dayLabel: {
    color: '#344054',
    fontSize: 14,
  },
  today: {
    borderColor: '#208AEF',
    borderWidth: 1,
  },
  selectedDay: {
    backgroundColor: '#208AEF',
  },
  selectedDayLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  disabledDay: {
    opacity: 0.4,
  },
  disabledDayLabel: {
    color: '#98A2B3',
  },
});
