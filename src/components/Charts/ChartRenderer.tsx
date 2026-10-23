import { Fragment, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path, Polyline, Rect, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../../hooks/use-theme';
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
                
import { Typography } from '../Typography/Typography';

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
}) => {
  const theme = useTheme();

  return (
    <View style={[chartStyles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <Typography text={title} variant='title' />
      {description ? <Typography text={description} variant='caption' /> : null}
      {children}
    </View>
  );
};

type ChartTooltipEntry = {
  name: string;
  value: number;
  color: string;
};

type ChartTooltipData = {
  label: string;
  entries: ChartTooltipEntry[];
  x: number;
  y: number;
};

const ChartTooltip = ({
  tooltip,
  width,
  height,
}: {
  tooltip: ChartTooltipData | null;
  width: number;
  height: number;
}) => {
  const theme = useTheme();

  if (!tooltip || width <= 0) {
    return null;
  }

  const tooltipWidth = Math.min(width - 16, 220);
  const tooltipHeight = 42 + tooltip.entries.length * 22;
  const left = Math.max(8, Math.min(tooltip.x + 8, width - tooltipWidth - 8));
  const top = Math.max(8, Math.min(tooltip.y - tooltipHeight - 8, height - tooltipHeight - 8));

  return (
    <View
      accessibilityLiveRegion="polite"
      pointerEvents="none"
      style={{
        backgroundColor: theme.backgroundElement,
        borderColor: theme.border,
        borderRadius: 8,
        borderWidth: 1,
        elevation: 4,
        left,
        maxWidth: tooltipWidth,
        paddingHorizontal: 12,
        paddingVertical: 8,
        position: 'absolute',
        top,
        zIndex: 1,
      }}
    >
      <Typography
        style={{ fontWeight: '600', marginBottom: 4 }}
        text={tooltip.label}
        variant="caption"
      />
      {tooltip.entries.map((entry) => (
        <View key={entry.name} style={{ alignItems: 'center', flexDirection: 'row', gap: 6 }}>
          <View
            style={{ backgroundColor: entry.color, borderRadius: 4, height: 8, width: 8 }}
          />
          <Typography text={`${entry.name}: ${entry.value}`} variant="caption" />
        </View>
      ))}
    </View>
  );
};

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
}) => {
  const theme = useTheme();

  return (
    <>
      {[0, 1, 2, 3, 4].map((step) => {
        const y = padding.top + plotHeight * (1 - step / 4);
        return (
          <Line
            key={step}
            stroke={theme.border}
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
            fill={theme.textSecondary}
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
};

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
  const [tooltip, setTooltip] = useState<ChartTooltipData | null>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const maximum = Math.max(1, ...data.flatMap((datum) => series.map(({ key }) => getChartValue(datum, key))));
  const points = getChartPoints(data, series, plotWidth, plotHeight, maximum);
  const baseline = padding.top + plotHeight;
  const slotWidth = plotWidth / Math.max(data.length, 1);
  const barWidth = Math.min(42, (slotWidth * 0.68) / series.length);

  return (
    <>
      <View
        onLayout={(event) => setChartWidth(event.nativeEvent.layout.width)}
        style={{ position: 'relative' }}
      >
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
        <Pressable
          accessibilityLabel={`Show ${kind} chart data`}
          accessibilityRole="button"
          onPress={(event) => {
            if (chartWidth === 0) {
              return;
            }

            const scale = Math.min(chartWidth / width, 1);
            const offsetX = (chartWidth - width * scale) / 2;
            const offsetY = (height - height * scale) / 2;
            const { locationX, locationY } = event.nativeEvent;
            const chartX = (locationX - offsetX) / scale;
            const chartY = (locationY - offsetY) / scale;
            if (
              chartX < padding.left ||
              chartX > padding.left + plotWidth ||
              chartY < padding.top ||
              chartY > baseline
            ) {
              setTooltip(null);
              return;
            }

            const slotWidth = plotWidth / data.length;
            const pointIndex = Math.max(
              0,
              Math.min(data.length - 1, Math.round((chartX - padding.left) / slotWidth - 0.5)),
            );
            setTooltip({
              label: data[pointIndex].label,
              entries: series.map((item) => ({
                name: item.name,
                value: getChartValue(data[pointIndex], item.key),
                color: item.color,
              })),
              x: locationX,
              y: locationY,
            });
          }}
          style={StyleSheet.absoluteFill}
        />
        <ChartTooltip height={height} tooltip={tooltip} width={chartWidth} />
      </View>
    </>
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
  const theme = useTheme();
  const [chartWidth, setChartWidth] = useState(0);
  const [tooltip, setTooltip] = useState<ChartTooltipData | null>(null);
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
    <View
      onLayout={(event) => setChartWidth(event.nativeEvent.layout.width)}
      style={{ position: 'relative' }}
    >
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
              <SvgText fill={theme.textSecondary} fontSize="12" textAnchor="end" x={left - 12} y={y + barHeight * 0.72}>
                {datum.label}
              </SvgText>
              <Rect
                fill={theme.backgroundSelected}
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
      <Pressable
        accessibilityLabel="Show horizontal bar chart data"
        accessibilityRole="button"
        onPress={(event) => {
          if (chartWidth === 0) {
            return;
          }

          const scale = Math.min(chartWidth / width, 1);
          const offsetX = (chartWidth - width * scale) / 2;
          const offsetY = (height - height * scale) / 2;
          const { locationX, locationY } = event.nativeEvent;
          const chartX = (locationX - offsetX) / scale;
          const chartY = (locationY - offsetY) / scale;
          if (
            chartX < left ||
            chartX > left + plotWidth ||
            chartY < top ||
            chartY > top + plotHeight
          ) {
            setTooltip(null);
            return;
          }

          const index = Math.min(data.length - 1, Math.floor((chartY - top) / rowHeight));
          const datum = data[index];
          setTooltip({
            label: datum.label,
            entries: [{
              name: series[0].name,
              value: getChartValue(datum, series[0].key),
              color: datum.color ?? series[0].color,
            }],
            x: locationX,
            y: locationY,
          });
        }}
        style={StyleSheet.absoluteFill}
      />
      <ChartTooltip height={height} tooltip={tooltip} width={chartWidth} />
    </View>
  );
};

const PieChart = ({ data, series, height }: { data: ChartDatum[]; series: ChartSeries[]; height: number }) => {
  const theme = useTheme();
  const center = 100;
  const radius = 82;
  const valueKey = series[0].key;
  const total = data.reduce((sum, datum) => sum + Math.max(0, getChartValue(datum, valueKey)), 0);
  const [tooltip, setTooltip] = useState<ChartTooltipData | null>(null);
  let angle = -90;

  return (
    <View style={chartStyles.pieLayout}>
      <View style={{ height, position: 'relative', width: 200 }}>
        <Svg
          accessibilityLabel="Pie chart"
          height={height}
          role="group"
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
                    d={path}
                    fill={color}
                    stroke={theme.backgroundElement}
                    strokeWidth={2}
                  />
                );
              })
            : null}
        </Svg>
        <Pressable
          accessibilityLabel="Show pie chart data"
          accessibilityRole="button"
          onPress={(event) => {
            const scale = Math.min(height / 200, 1);
            const offsetY = (height - 200 * scale) / 2;
            const chartX = event.nativeEvent.locationX;
            const chartY = (event.nativeEvent.locationY - offsetY) / scale;
            const distance = Math.hypot(chartX - center, chartY - center);
            if (total <= 0 || distance > radius) {
              setTooltip(null);
              return;
            }

            const touchAngle =
              (Math.atan2(chartY - center, chartX - center) * 180 / Math.PI + 450) % 360;
            let angleStart = 0;
            const index = data.findIndex((datum) => {
              const value = Math.max(0, getChartValue(datum, valueKey));
              const angleEnd = angleStart + (value / total) * 360;
              const containsTouch = touchAngle >= angleStart && touchAngle < angleEnd;
              angleStart = angleEnd;
              return containsTouch;
            });
            if (index < 0) {
              setTooltip(null);
              return;
            }

            const datum = data[index];
            setTooltip({
              label: datum.label,
              entries: [{
                name: series[0].name,
                value: getChartValue(datum, valueKey),
                color: datum.color ?? chartPalette[index % chartPalette.length],
              }],
              x: event.nativeEvent.locationX,
              y: event.nativeEvent.locationY,
            });
          }}
          style={StyleSheet.absoluteFill}
        />
        <ChartTooltip height={height} tooltip={tooltip} width={200} />
      </View>
      <View style={chartStyles.legend}>
        {data.map((datum, index) => {
          const color = datum.color ?? chartPalette[index % chartPalette.length];
          const value = Math.max(0, getChartValue(datum, valueKey));
          const percent = total > 0 ? Math.round((value / total) * 100) : 0;
          return (
            <View key={`${datum.label}-${index}`} style={chartStyles.legendItem}>
              <View style={[chartStyles.legendDot, { backgroundColor: color }]} />
              <Typography text={`${datum.label} · ${percent}%`} variant='caption' />
            </View>
          );
        })}
      </View>
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
        <Typography text="No data available." variant='caption'/>
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
