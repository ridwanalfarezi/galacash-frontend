'use client'

import * as React from 'react'
import { Label, Pie, PieChart, Sector } from 'recharts'
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

export function FinancialPieChart({ data, title, type, className }: FinancialPieChartProps) {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

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

  const titleColor = type === 'income' ? 'text-green-700' : 'text-red-700'

  if (!isMounted) {
    return (
      <div className={className}>
        <div className="mx-auto flex aspect-square w-full max-w-[350px] items-center justify-center">
          <div className="text-center">
            <div className={`mb-2 text-sm font-medium ${titleColor}`}>{title}</div>
            <div className="text-xl font-bold">{formatCurrency(total)}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[350px]">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value) => formatCurrency(value as number)}
              />
            }
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={80}
            strokeWidth={5}
            activeShape={renderActiveShape}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 12}>
                        {title}
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox?.cy || 0) + 12}>
                        {formatCurrency(total)}
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  )
}
