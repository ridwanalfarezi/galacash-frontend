'use client'

import * as React from 'react'
import { Pie, PieChart, Sector } from 'recharts'
import type { PieSectorDataItem } from 'recharts/types/polar/Pie'

import { formatCurrency } from '~/lib/utils'

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart'

interface ChartDataItem {
  name: string
  value: number
  fill: string
}

interface FinancialPieChartProps {
  data: ChartDataItem[]
  title: string
  type: 'income' | 'expense'
  className?: string
}

export function FinancialPieChart({ data, title, className }: FinancialPieChartProps) {
  const total = React.useMemo(() => data.reduce((acc, item) => acc + item.value, 0), [data])

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      value: { label: 'Nilai' },
    }

    data.forEach((item) => {
      config[item.name.toLowerCase().replace(/\s+/g, '_')] = {
        label: item.name,
        color: item.fill,
      }
    })

    return config
  }, [data])

  const renderActiveShape = ({ outerRadius = 0, ...props }: PieSectorDataItem) => {
    return <Sector {...props} outerRadius={outerRadius + 10} />
  }

  return (
    <div className={className}>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square min-h-[200px] w-full max-w-[350px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, item, payload) => {
                  const { fill } = payload.payload as ChartDataItem
                  return (
                    <>
                      <span className={'text-sm capitalize'} style={{ color: `${fill}` }}>
                        {item}
                      </span>
                      <span className="text-sm">{formatCurrency(value as number)}</span>
                    </>
                  )
                }}
              />
            }
          />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
            <tspan
              x="50%"
              dy="-1em"
              className={`text-sm ${title === 'Pemasukan' ? 'fill-green-700' : 'fill-red-700'}`}
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
      </ChartContainer>
    </div>
  )
}
