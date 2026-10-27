import { Charts } from '../../components';
import { busyTimesLastWeek, categorySales, monthlySales } from './chartData';

export const ChartsDemo = () => (
  <>
    <Charts.Bar
      data={monthlySales}
      description="Orders and sales, in thousands"
      series={[
        { key: 'sales', name: 'Sales', color: '#2563EB' },
        { key: 'orders', name: 'Orders', color: '#16A34A' },
      ]}
      title="Monthly sales"
    />
    <Charts.Line
      data={busyTimesLastWeek}
      description="Compare sales and order trends"
      series={[
        { key: 'purchases', name: 'Purchases That Day', color: '#2563EB' },
      ]}
      title="Sales line chart"
    />
    <Charts.Graph
      data={monthlySales}
      description="Sales volume over four months"
      series={[{ key: 'sales', name: 'Sales', color: '#7C3AED' }]}
      title="Sales graph"
    />
    <Charts.HorizontalBar
      data={categorySales}
      description="A quick comparison by category"
      series={[{ key: 'value', name: 'Sales', color: '#2563EB' }]}
      title="Sales by category"
    />
    <Charts.Pie
      data={categorySales}
      description="Share of sample sales"
      series={[{ key: 'value', name: 'Share', color: '#2563EB' }]}
      title="Category mix"
    />
  </>
);
