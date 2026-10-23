import { Fragment, useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Polyline, Rect, Text as SvgText } from 'react-native-svg';
import { chartStyles } from './style';
import {
  chartPalette,
  defaultSeries,
  getChartValue,
  type ChartDatum,
  type ChartKind,
  type ChartProps,
  type ChartSeries,
} from './types';

const width = 360;
const padding = { top: 18, right: 16, bottom: 38, left: 42 };

const getChartPoints = (
  data: ChartDatum[],
  series: ChartSeries[],
  plotWidth: number,
  plotHeight: number,
  maximum: number,
) =>
  series.map((item) =>
    data.map((datum, index) => ({
      x: padding.left + (plotWidth * (index + 0.5)) / Math.max(data.length, 1),
      y: padding.top + plotHeight * (1 - getChartValue(datum, item.key) / maximum),
    })),
  );

const getWedgePath = (center: number, radius: number, start: number, end: number) => {
  const point = (angle: number) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(radians),
      y: center + radius * Math.sin(radians),
    };
  };
  const first = point(start);
  const last = point(end);
  const largeArc = end - start > 180 ? 1 : 0;
  return `M ${center} ${center} L ${first.x} ${first.y} A ${radius} ${radius} 0 ${largeArc} 1 ${last.x} ${last.y} Z`;
};

const ChartFrame = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) => (
  <View style={chartStyles.card}>
    <Text style={chartStyles.title}>{title}</Text>
    {description ? <Text style={chartStyles.description}>{description}</Text> : null}
    {children}
  </View>
);

const AxisLabels = ({
  data,
  height,
  plotWidth,
  plotHeight,
}: {
  data: ChartDatum[];
  height: number;
  plotWidth: number;
  plotHeight: number;
}) => (
  <>
    {[0, 1, 2, 3, 4].map((step) => {
      const y = padding.top + plotHeight * (1 - step / 4);
      return (
        <Line
          key={step}
          stroke="#E4E7EC"
          strokeDasharray="3 4"
          x1={padding.left}
          x2={padding.left + plotWidth}
          y1={y}
          y2={y}
        />
      );
    })}
    {data.map((datum, index) => {
      const x =
        padding.left +
        (plotWidth * (index + 0.5)) / Math.max(data.length, 1);
      return (
        <SvgText
          key={`${datum.label}-${index}`}
          fill="#667085"
          fontSize="11"
          textAnchor="middle"
          x={x}
          y={height - 10}
        >
          {datum.label}
        </SvgText>
      );
    })}
  </>
);

const VerticalChart = ({
  kind,
  data,
  series,
  height,
}: {
  kind: 'bar' | 'line' | 'area';
  data: ChartDatum[];
  series: ChartSeries[];
  height: number;
}) => {
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const maximum = Math.max(1, ...data.flatMap((datum) => series.map(({ key }) => getChartValue(datum, key))));
  const points = getChartPoints(data, series, plotWidth, plotHeight, maximum);
  const baseline = padding.top + plotHeight;
  const slotWidth = plotWidth / Math.max(data.length, 1);
  const barWidth = Math.min(42, (slotWidth * 0.68) / series.length);

  return (
    <Svg
      accessibilityLabel={`${kind} chart`}
      height={height}
      role="img"
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
    >
      <AxisLabels
        data={data}
        height={height}
        plotHeight={plotHeight}
        plotWidth={plotWidth}
      />
      {kind === 'bar'
        ? series.flatMap((item, seriesIndex) =>
            data.map((datum, index) => {
              const value = getChartValue(datum, item.key);
              const barHeight = plotHeight * (value / maximum);
              const centerX =
                padding.left +
                (plotWidth * (index + 0.5)) / Math.max(data.length, 1);
              const x = centerX - (series.length * barWidth) / 2 + seriesIndex * barWidth;
              return (
                <Rect
                  key={`${item.key}-${datum.label}`}
                  fill={item.color}
                  height={barHeight}
                  rx={4}
                  width={barWidth * 0.82}
                  x={x}
                  y={baseline - barHeight}
                />
              );
            }),
          )
        : series.map((item, index) => {
            const linePoints = points[index].map(({ x, y }) => `${x},${y}`).join(' ');
            const areaPoints = `${points[index][0]?.x ?? padding.left},${baseline} ${linePoints} ${
              points[index][points[index].length - 1]?.x ?? padding.left
            },${baseline}`;
            return (
              <Fragment key={item.key}>
                {kind === 'area' ? (
                  <Polyline
                    fill={item.color}
                    fillOpacity={0.12}
                    points={areaPoints}
                    stroke="none"
                  />
                ) : null}
                <Polyline
                  fill="none"
                  points={linePoints}
                  stroke={item.color}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                />
                {points[index].map(({ x, y }, pointIndex) => (
                  <Circle
                    key={`${item.key}-${data[pointIndex].label}`}
                    cx={x}
                    cy={y}
                    fill={item.color}
                    r={3.5}
                  />
                ))}
              </Fragment>
            );
          })}
    </Svg>
  );
};

const HorizontalBarChart = ({
  data,
  series,
  height,
}: {
  data: ChartDatum[];
  series: ChartSeries[];
  height: number;
}) => {
  const left = 56;
  const right = 16;
  const top = 12;
  const bottom = 12;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const maximum = Math.max(1, ...data.map((datum) => getChartValue(datum, series[0].key)));
  const rowHeight = plotHeight / Math.max(data.length, 1);
  const barHeight = Math.min(24, rowHeight * 0.62);

  return (
    <Svg
      accessibilityLabel="Horizontal bar chart"
      height={height}
      role="img"
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
    >
      {data.map((datum, index) => {
        const y = top + index * rowHeight + (rowHeight - barHeight) / 2;
        const value = getChartValue(datum, series[0].key);
        return (
          <Fragment key={`${datum.label}-${index}`}>
            <SvgText fill="#475467" fontSize="12" textAnchor="end" x={left - 12} y={y + barHeight * 0.72}>
              {datum.label}
            </SvgText>
            <Rect
              fill="#F2F4F7"
              height={barHeight}
              rx={5}
              width={plotWidth}
              x={left}
              y={y}
            />
            <Rect
              fill={datum.color ?? series[0].color}
              height={barHeight}
              rx={5}
              width={plotWidth * (value / maximum)}
              x={left}
              y={y}
            />
          </Fragment>
        );
      })}
    </Svg>
  );
};

const PieChart = ({ data, series, height }: { data: ChartDatum[]; series: ChartSeries[]; height: number }) => {
  const center = 100;
  const radius = 82;
  const valueKey = series[0].key;
  const total = data.reduce((sum, datum) => sum + Math.max(0, getChartValue(datum, valueKey)), 0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedDatum = selectedIndex === null ? undefined : data[selectedIndex];
  let angle = -90;

  return (
    <View style={chartStyles.pieLayout}>
      <Svg
        accessibilityLabel="Pie chart"
        height={height}
        role="img"
        viewBox="0 0 200 200"
        width={200}
      >
        {total > 0
          ? data.map((datum, index) => {
              const value = Math.max(0, getChartValue(datum, valueKey));
              const nextAngle = angle + (value / total) * 360;
              const path = getWedgePath(center, radius, angle, nextAngle);
              const color = datum.color ?? chartPalette[index % chartPalette.length];
              angle = nextAngle;
              return (
                <Path
                  key={`${datum.label}-${index}`}
                  accessibilityLabel={`${datum.label}, ${value} (${Math.round((value / total) * 100)}%). Tap for details.`}
                  accessibilityRole="button"
                  d={path}
                  fill={color}
                  onPress={() => setSelectedIndex(index)}
                  stroke="#FFFFFF"
                  strokeWidth={selectedIndex === index ? 4 : 2}
                />
              );
            })
          : null}
      </Svg>
      <View style={chartStyles.legend}>
        {data.map((datum, index) => {
          const color = datum.color ?? chartPalette[index % chartPalette.length];
          const value = Math.max(0, getChartValue(datum, valueKey));
          const percent = total > 0 ? Math.round((value / total) * 100) : 0;
          return (
            <Pressable
              key={`${datum.label}-${index}`}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedIndex === index }}
              onPress={() => setSelectedIndex(index)}
              style={chartStyles.legendItem}
            >
              <View style={[chartStyles.legendDot, { backgroundColor: color }]} />
              <Text style={chartStyles.legendText}>
                {datum.label} · {percent}%
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={chartStyles.pieSelection} accessibilityLiveRegion="polite">
        {selectedDatum
          ? `${selectedDatum.label}: ${getChartValue(selectedDatum, valueKey)} (${Math.round(
              (Math.max(0, getChartValue(selectedDatum, valueKey)) / total) * 100,
            )}%)`
          : 'Tap a slice or label for details.'}
      </Text>
    </View>
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
  const chartSeries = series.length > 0 ? series : defaultSeries;

  return (
    <ChartFrame title={title} description={description}>
      {data.length === 0 ? (
        <Text style={chartStyles.empty}>No data available.</Text>
      ) : kind === 'pie' ? (
        <PieChart data={data} height={Math.max(200, Math.min(height, 260))} series={chartSeries} />
      ) : kind === 'horizontal-bar' ? (
        <HorizontalBarChart data={data} height={height} series={chartSeries} />
      ) : (
        <VerticalChart data={data} height={height} kind={kind} series={chartSeries} />
      )}
    </ChartFrame>
  );
};
