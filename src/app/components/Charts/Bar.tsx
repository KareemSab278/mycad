import { ChartRenderer } from './ChartRenderer';
import type { ChartProps } from './types';

export const Bar = (props: ChartProps) => <ChartRenderer kind="bar" {...props} />;