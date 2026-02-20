'use client';

import * as React from 'react';

import { Skeleton } from '~/components/ui/skeleton';

import { type ChartConfig } from './chart-context';

// Re-export for backward compatibility
export { ChartContext, useChart, type ChartConfig } from './chart-context';

// Loading fallback
function ChartSkeleton() {
  return (
    <div className="flex aspect-video items-center justify-center">
      <Skeleton className="size-48 rounded-full" />
    </div>
  );
}

// Lazy loaded implementations
const ChartContainerImpl = React.lazy(() =>
  import('./chart-impl').then((mod) => ({ default: mod.ChartContainerImpl }))
);

const ChartTooltipImpl = React.lazy(() =>
  import('./chart-impl').then((mod) => ({ default: mod.ChartTooltipImpl }))
);

const ChartTooltipContentImpl = React.lazy(() =>
  import('./chart-impl').then((mod) => ({ default: mod.ChartTooltipContentImpl }))
);

const ChartLegendImpl = React.lazy(() =>
  import('./chart-impl').then((mod) => ({ default: mod.ChartLegendImpl }))
);

const ChartLegendContentImpl = React.lazy(() =>
  import('./chart-impl').then((mod) => ({ default: mod.ChartLegendContentImpl }))
);

const ChartStyleImpl = React.lazy(() =>
  import('./chart-impl').then((mod) => ({ default: mod.ChartStyleImpl }))
);

// Export wrapped components
export function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig;
  children: React.ReactNode;
}) {
  return (
    <React.Suspense fallback={<ChartSkeleton />}>
      <ChartContainerImpl id={id} className={className} config={config} {...props}>
        {children}
      </ChartContainerImpl>
    </React.Suspense>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ChartTooltip(props: any) {
  return (
    <React.Suspense fallback={null}>
      <ChartTooltipImpl {...props} />
    </React.Suspense>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ChartTooltipContent(props: any) {
  return (
    <React.Suspense fallback={null}>
      <ChartTooltipContentImpl {...props} />
    </React.Suspense>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ChartLegend(props: any) {
  return (
    <React.Suspense fallback={null}>
      <ChartLegendImpl {...props} />
    </React.Suspense>
  );
}

export function ChartLegendContent(props: React.ComponentProps<'div'>) {
  return (
    <React.Suspense fallback={null}>
      <ChartLegendContentImpl {...props} />
    </React.Suspense>
  );
}

export function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  return (
    <React.Suspense fallback={null}>
      <ChartStyleImpl id={id} config={config} />
    </React.Suspense>
  );
}
