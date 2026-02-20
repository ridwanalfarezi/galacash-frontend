'use client';

import * as React from 'react';

import { Skeleton } from '~/components/ui/skeleton';

// Loading fallback for pie chart
function PieChartSkeleton() {
  return (
    <div className="flex aspect-square items-center justify-center">
      <Skeleton className="size-48 rounded-full" />
    </div>
  );
}

// Lazy load the actual pie chart component
const FinancialPieChartBaseInner = React.lazy(() => import('./FinancialPieChartBase'));

interface FinancialPieChartProps {
  data: Array<{
    name: string;
    value: number;
    fill: string;
    [key: string]: string | number;
  }>;
  title: string;
  type: 'income' | 'expense';
  className?: string;
}

const FinancialPieChart = React.memo(function FinancialPieChart(props: FinancialPieChartProps) {
  return (
    <React.Suspense fallback={<PieChartSkeleton />}>
      <FinancialPieChartBaseInner {...props} />
    </React.Suspense>
  );
});

export { FinancialPieChart };
