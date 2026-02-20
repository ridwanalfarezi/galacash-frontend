'use client';

import * as React from 'react';
import { Pie, PieChart, Sector } from 'recharts';
import type { PieSectorDataItem } from 'recharts/types/polar/Pie';

import { formatCurrency } from '~/lib/utils';

import { type ChartConfig } from '../ui/chart-context';
import { ChartContainerImpl, ChartTooltipImpl, ChartTooltipContentImpl } from '../ui/chart-impl';

interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
  [key: string]: string | number;
}

interface FinancialPieChartProps {
  data: ChartDataItem[];
  title: string;
  type: 'income' | 'expense';
  className?: string;
}

const renderActiveShape = ({ outerRadius = 0, ...props }: PieSectorDataItem) => {
  return <Sector {...props} outerRadius={outerRadius + 10} />;
};

export default function FinancialPieChartBase({
  data,
  title,
  type,
  className,
}: FinancialPieChartProps) {
  const total = React.useMemo(() => data.reduce((acc, item) => acc + item.value, 0), [data]);

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      value: { label: 'Nilai' },
    };

    data.forEach((item) => {
      config[item.name.toLowerCase().replace(/\s+/g, '_')] = {
        label: item.name,
        color: item.fill,
      };
    });

    return config;
  }, [data]);

  return (
    <div className={className}>
      <ChartContainerImpl
        config={chartConfig}
        className="mx-auto aspect-square min-h-50 w-full max-w-87.5"
      >
        <PieChart>
          <ChartTooltipImpl
            cursor={false}
            content={
              <ChartTooltipContentImpl
                hideLabel
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any, item: any, payload: any) => {
                  const { fill } = payload.payload as ChartDataItem;
                  return (
                    <>
                      <span className={'text-sm capitalize'} style={{ color: `${fill}` }}>
                        {item}
                      </span>
                      <span className="text-sm">{formatCurrency(value as number)}</span>
                    </>
                  );
                }}
              />
            }
          />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
            <tspan
              x="50%"
              dy="-1em"
              className={`text-sm ${type === 'income' ? 'fill-green-700' : 'fill-red-700'}`}
            >
              {title}
            </tspan>
            <tspan x="50%" dy="1.5em" className="fill-gray-900 text-base font-semibold">
              {formatCurrency(total)}
            </tspan>
          </text>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={80}
            strokeWidth={5}
            activeShape={renderActiveShape}
          />
        </PieChart>
      </ChartContainerImpl>
    </div>
  );
}
