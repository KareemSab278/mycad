import { ChartRenderer } from './ChartRenderer';
import type { ChartProps } from './types';

export const Pie = (props: ChartProps) => <ChartRenderer kind="pie" {...props} />;