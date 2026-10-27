import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  section: { gap: 6 },
  sectionTitle: { fontSize: 15, fontWeight: '700', lineHeight: 21 },
  description: { fontSize: 14, lineHeight: 21 },
  note: { fontSize: 12, lineHeight: 18 },
  fields: { gap: 14, marginTop: 10 },
  fieldRow: { gap: 14 },
  fieldRowWide: { flexDirection: 'row' },
  field: { flex: 1, minWidth: 0 },
  dateButton: {
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
  },
  input: { fontSize: 14 },
  dayRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 18, marginTop: 8 },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  sliderValue: { color: '#14b8ac', fontWeight: '700' },
});
