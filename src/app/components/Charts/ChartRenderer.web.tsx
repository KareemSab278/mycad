import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { CSSProperties } from 'react';
import { chartPalette, defaultSeries, type ChartKind, type ChartProps } from './types';

const cardStyle: CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E4E7EC',
  borderRadius: 12,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  minWidth: 0,
  padding: 16,
  width: '100%',
};

const chartStyle: CSSProperties = { height: 240, minWidth: 0, width: '100%' };
const gridColor = '#E4E7EC';
const axisStyle = { fill: '#667085', fontSize: 12 };
const tooltipStyle: CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E4E7EC',
  borderRadius: 8,
  color: '#101828',
  fontSize: 13,
  padding: '8px 12px',
};

const Heading = ({ title, description }: { title: string; description?: string }) => (
  <header>
    <h3 style={{ color: '#101828', fontSize: 16, fontWeight: 600, margin: 0 }}>{title}</h3>
    {description ? (
      <p style={{ color: '#667085', fontSize: 13, lineHeight: '19px', margin: '4px 0 0' }}>
        {description}
      </p>
    ) : null}
  </header>
);

const Axes = ({ horizontal = false }: { horizontal?: boolean }) => (
  <>
    <CartesianGrid stroke={gridColor} strokeDasharray="3 4" vertical={false} />
    <XAxis
      axisLine={false}
      dataKey={horizontal ? undefined : 'label'}
      tick={axisStyle}
      tickLine={false}
      type={horizontal ? 'number' : 'category'}
    />
    <YAxis
      axisLine={false}
      dataKey={horizontal ? 'label' : undefined}
      tick={axisStyle}
      tickLine={false}
      type={horizontal ? 'category' : 'number'}
      width={horizontal ? 56 : 40}
    />
    <Tooltip contentStyle={tooltipStyle} />
  </>
);

const ChartContent = ({
  kind,
  data,
  series,
}: {
  kind: ChartKind;
  data: ChartProps['data'];
  series: NonNullable<ChartProps['series']>;
}) => {
  if (kind === 'bar') {
    return (
      <RechartsBarChart data={data} margin={{ top: 12, right: 8, bottom: 0, left: -16 }}>
        <Axes />
        {series.map((item) => (
          <Bar
            key={item.key}
            dataKey={item.key}
            fill={item.color}
            name={item.name}
            radius={[5, 5, 0, 0]}
          />
        ))}
        {series.length > 1 ? <Legend /> : null}
      </RechartsBarChart>
    );
  }

  if (kind === 'line') {
    return (
      <RechartsLineChart data={data} margin={{ top: 12, right: 8, bottom: 0, left: -16 }}>
        <Axes />
        {series.map((item) => (
          <Line
            key={item.key}
            dataKey={item.key}
            dot={{ r: 3 }}
            name={item.name}
            stroke={item.color}
            strokeWidth={2.5}
            type="monotone"
          />
        ))}
        {series.length > 1 ? <Legend /> : null}
      </RechartsLineChart>
    );
  }

  if (kind === 'area') {
    return (
      <RechartsAreaChart data={data} margin={{ top: 12, right: 8, bottom: 0, left: -16 }}>
        <Axes />
        {series.map((item) => (
          <Area
            key={item.key}
            dataKey={item.key}
            fill={item.color}
            fillOpacity={0.16}
            name={item.name}
            stroke={item.color}
            strokeWidth={2.5}
            type="monotone"
          />
        ))}
        {series.length > 1 ? <Legend /> : null}
      </RechartsAreaChart>
    );
  }

  if (kind === 'horizontal-bar') {
    const item = series[0];
    return (
      <RechartsBarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 12, bottom: 8, left: 0 }}
      >
        <Axes horizontal />
        <Bar dataKey={item.key} fill={item.color} name={item.name} radius={[0, 5, 5, 0]} />
      </RechartsBarChart>
    );
  }

  const valueKey = series[0].key;
  return (
    <RechartsPieChart>
      <Tooltip contentStyle={tooltipStyle} />
      <Legend />
      <Pie data={data} dataKey={valueKey} innerRadius="48%" nameKey="label" outerRadius="78%">
        {data.map((datum, index) => (
          <Cell
            key={`${datum.label}-${index}`}
            fill={datum.color ?? chartPalette[index % chartPalette.length]}
          />
        ))}
      </Pie>
    </RechartsPieChart>
  );
};

export const ChartRenderer = ({
  kind,
  data,
  title,
  description,
  series = defaultSeries,
  height = 240,
}: ChartProps & { kind: ChartKind }) => (
  <section style={cardStyle}>
    <Heading title={title} description={description} />
    {data.length === 0 ? (
      <p style={{ color: '#667085', fontSize: 14, margin: '12px 0' }}>No data available.</p>
    ) : (
      <div
        aria-label={`${title} ${kind} chart`}
        role="img"
        style={{ ...chartStyle, height: kind === 'pie' ? Math.max(220, height) : height }}
      >
        <ResponsiveContainer height="100%" width="100%">
          <ChartContent data={data} kind={kind} series={series} />
        </ResponsiveContainer>
      </div>
    )}
  </section>
);
