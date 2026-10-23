import { ChartRenderer } from './ChartRenderer';
import type { ChartProps } from './types';

export const AreaChart = (props: ChartProps) => <ChartRenderer kind="area" {...props} />;