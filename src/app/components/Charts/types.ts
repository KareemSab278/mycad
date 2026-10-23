export type ChartDatum = {
  label: string;
  color?: string;
  [key: string]: number | string | undefined;
};

export type ChartSeries = {
  key: string;
  name: string;
  color: string;
};

export type ChartProps = {
  data: ChartDatum[];
  title: string;
  description?: string;
  series?: ChartSeries[];
  height?: number;
};

export type ChartKind = 'bar' | 'line' | 'area' | 'horizontal-bar' | 'pie';

export const chartPalette = [
  '#2563EB',
  '#16A34A',
  '#F59E0B',
  '#DB2777',
  '#7C3AED',
  '#0891B2',
];

export const defaultSeries: ChartSeries[] = [
  { key: 'value', name: 'Value', color: chartPalette[0] },
];

export const getChartValue = (datum: ChartDatum, key: string) => {
  const value = Number(datum[key]);
  return Number.isFinite(value) ? value : 0;
};
