import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  pageContent: {
    alignSelf: 'center',
    boxSizing: 'border-box',
    gap: 24,
    maxWidth: 760,
    paddingHorizontal: 20,
    paddingVertical: 24,
    width: '100%',
  },
  header: {
    gap: 6,
  },
  eyebrow: {
    color: '#1570EF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    color: '#101828',
    fontSize: 30,
    fontWeight: '700',
  },
  subtitle: {
    color: '#667085',
    fontSize: 15,
    lineHeight: 22,
  },
  panel: {
    gap: 24,
  },
  buttonRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  formStack: {
    gap: 18,
  },
  feedbackSurface: {
    alignItems: 'center',
    backgroundColor: '#EFF8FF',
    borderRadius: 10,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  feedbackText: {
    color: '#175CD3',
    fontSize: 15,
    fontWeight: '500',
  },
  resultText: {
    color: '#475467',
    fontSize: 14,
  },
  displayStack: {
    gap: 14,
  },
  alertOverlay: {
    alignItems: 'flex-start',
    bottom: 0,
    left: 0,
    // paddingHorizontal: 16,
    paddingBottom: 16,
    position: 'absolute',
    right: 0,
    zIndex: 10,
  },
  alertStack: {
    gap: 8,
    maxWidth: 480,
    width: '100%',
  },
  cardContent: {
    gap: 8,
  },
  cardTitle: {
    color: '#101828',
    fontSize: 16,
    fontWeight: '600',
  },
  cardDescription: {
    color: '#667085',
    fontSize: 14,
    lineHeight: 20,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E4E7EC',
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
    overflow: 'hidden',
    padding: 16,
    ...Platform.select({
      web: { boxSizing: 'border-box' as const, width: '100%' as const },
    }),
  },
  chartTitle: {
    color: '#101828',
    fontSize: 16,
    fontWeight: '600' as const,
    margin: 0,
  },
  chartDescription: {
    color: '#667085',
    fontSize: 13,
    lineHeight: 19,
    margin: 0,
  },
  chartSummary: {
    color: '#475467',
    fontSize: 13,
    margin: 0,
  },
});
