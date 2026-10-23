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
import { useTheme } from '../../hooks/use-theme';
import { chartPalette, defaultSeries, type ChartKind, type ChartProps } from './types';

const cardStyle: CSSProperties = {
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
const tooltipStyle: CSSProperties = {
  borderRadius: 8,
  fontSize: 13,
  padding: '8px 12px',
};

const Heading = ({ title, description }: { title: string; description?: string }) => {
  const theme = useTheme();

  return (
    <header>
      <h3 style={{ color: theme.text, fontSize: 16, fontWeight: 600, margin: 0 }}>{title}</h3>
      {description ? (
        <p style={{ color: theme.textSecondary, fontSize: 13, lineHeight: '19px', margin: '4px 0 0' }}>
          {description}
        </p>
      ) : null}
    </header>
  );
};

const Axes = ({ horizontal = false }: { horizontal?: boolean }) => {
  const theme = useTheme();
  const axisStyle = { fill: theme.textSecondary, fontSize: 12 };

  return (
    <>
      <CartesianGrid stroke={theme.border} strokeDasharray="3 4" vertical={false} />
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
      <Tooltip
        contentStyle={{
          ...tooltipStyle,
          backgroundColor: theme.backgroundElement,
          border: `1px solid ${theme.border}`,
          color: theme.text,
        }}
      />
    </>
  );
};

const ChartContent = ({
  kind,
  data,
  series,
}: {
  kind: ChartKind;
  data: ChartProps['data'];
  series: NonNullable<ChartProps['series']>;
}) => {
  const theme = useTheme();

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
        {series.length > 1 ? <Legend wrapperStyle={{ color: theme.textSecondary }} /> : null}
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
        {series.length > 1 ? <Legend wrapperStyle={{ color: theme.textSecondary }} /> : null}
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
        {series.length > 1 ? <Legend wrapperStyle={{ color: theme.textSecondary }} /> : null}
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
      <Tooltip
        contentStyle={{
          ...tooltipStyle,
          backgroundColor: theme.backgroundElement,
          border: `1px solid ${theme.border}`,
          color: theme.text,
        }}
      />
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

const PieLegend = ({
  data,
  valueKey,
}: {
  data: ChartProps['data'];
  valueKey: string;
}) => {
  const theme = useTheme();
  const total = data.reduce((sum, datum) => sum + Math.max(0, Number(datum[valueKey]) || 0), 0);

  return (
    <div
      aria-label="Category shares"
      role="list"
      style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', justifyContent: 'center' }}
    >
      {data.map((datum, index) => {
        const value = Math.max(0, Number(datum[valueKey]) || 0);
        const percent = total > 0 ? Math.round((value / total) * 100) : 0;
        return (
          <div
            key={`${datum.label}-${index}`}
            role="listitem"
            style={{ alignItems: 'center', display: 'inline-flex', gap: 6 }}
          >
            <span
              aria-hidden="true"
              style={{
                backgroundColor: datum.color ?? chartPalette[index % chartPalette.length],
                borderRadius: '50%',
                height: 10,
                width: 10,
              }}
            />
            <span style={{ color: theme.textSecondary, fontSize: 12 }}>
              {datum.label} · {percent}%
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const ChartRenderer = ({
  kind,
  data,
  title,
  description,
  series = defaultSeries,
  height = 240,
}: ChartProps & { kind: ChartKind }) => {
  const theme = useTheme();

  return (
    <section
      style={{
        ...cardStyle,
        backgroundColor: theme.backgroundElement,
        border: `1px solid ${theme.border}`,
      }}
    >
      <Heading title={title} description={description} />
      {data.length === 0 ? (
        <p style={{ color: theme.textSecondary, fontSize: 14, margin: '12px 0' }}>
          No data available.
        </p>
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
      {kind === 'pie' && data.length > 0 ? (
        <PieLegend data={data} valueKey={series[0]?.key ?? 'value'} />
      ) : null}
    </section>
  );
};
