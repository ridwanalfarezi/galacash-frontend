'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import type {
  NameType as RechartsNameType,
  Payload as RechartsPayload,
  ValueType as RechartsValueType,
} from 'recharts/types/component/DefaultTooltipContent';

import { cn } from '~/lib/utils';

// Import context from the separate context file
import { ChartContext, useChart, type ChartConfig } from './chart-context';

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark' } as const;

// Module-level constants for default prop values
const EMPTY_PAYLOAD: never[] = [];
const EMPTY_PAYLOAD_LEGEND: never[] = [];

export function ChartContainerImpl({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children'];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useLayoutEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const width = Math.max(1, Math.floor(rect.width));
        const height = Math.max(1, Math.floor(rect.height));
        setDimensions({ width, height });
      }
    };

    // Initial measurement
    updateDimensions();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const w = Math.max(1, Math.floor(width));
        const h = Math.max(1, Math.floor(height));
        setDimensions({ width: w, height: h });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const hasValidDimensions = dimensions.width > 0 && dimensions.height > 0;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={containerRef}
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border relative aspect-video h-full min-h-[300px] w-full text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyleImpl id={chartId} config={config} />
        {hasValidDimensions ? (
          <RechartsPrimitive.ResponsiveContainer
            width={dimensions.width}
            height={dimensions.height}
          >
            {children}
          </RechartsPrimitive.ResponsiveContainer>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-48 w-48 animate-pulse rounded-full bg-gray-200" />
          </div>
        )}
      </div>
    </ChartContext.Provider>
  );
}

export function ChartStyleImpl({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(([, config]) => config.theme || config.color);

  // Generate CSS custom properties for chart theming
  const cssVariables = React.useMemo(() => {
    const variables: Record<string, string> = {};

    colorConfig.forEach(([key, itemConfig]) => {
      Object.entries(THEMES).forEach(([theme]) => {
        const color =
          itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color;
        if (color) {
          const varName = theme === 'dark' ? `--color-${key}` : `--color-${key}`;
          variables[varName] = color;
        }
      });
    });

    return variables;
  }, [colorConfig]);

  if (!colorConfig.length) {
    return null;
  }

  // Use inline styles instead of dangerouslySetInnerHTML
  return <div data-chart-styles={id} style={cssVariables} className="sr-only" aria-hidden="true" />;
}

export const ChartTooltipImpl = RechartsPrimitive.Tooltip;

export function ChartTooltipContentImpl({
  active,
  payload = EMPTY_PAYLOAD,
  className,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: Omit<React.ComponentProps<typeof RechartsPrimitive.Tooltip>, 'payload'> &
  React.ComponentProps<'div'> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: 'line' | 'dot' | 'dashed';
    nameKey?: string;
    labelKey?: string;
    label?: React.ReactNode;
    payload?: ReadonlyArray<RechartsPayload<RechartsValueType, RechartsNameType>>;
  }) {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const key = `${labelKey || item?.dataKey || item?.name || 'value'}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === 'string'
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn('font-medium', labelClassName)}>{labelFormatter(value, payload)}</div>
      );
    }

    if (!value) {
      return null;
    }

    return <div className={cn('font-medium', labelClassName)}>{value}</div>;
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

  if (!active || !payload?.length) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== 'dot';

  return (
    <div
      className={cn(
        'border-border/50 bg-background grid min-w-32 items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl',
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || 'value'}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor = color || item.payload?.fill || item.color;

          return (
            <div
              key={String(item.dataKey ?? item.name ?? index)}
              className={cn(
                '[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5',
                indicator === 'dot' && 'items-center'
              )}
            >
              {formatter && item?.value !== undefined && item.name ? (
                formatter(
                  item.value,
                  item.name,
                  item as RechartsPayload<RechartsValueType, RechartsNameType>,
                  index,
                  payload as ReadonlyArray<RechartsPayload<RechartsValueType, RechartsNameType>>
                )
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <div
                        className={cn(
                          'shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)',
                          {
                            'h-2.5 w-2.5': indicator === 'dot',
                            'w-1': indicator === 'line',
                            'w-0 border-[1.5px] border-dashed bg-transparent':
                              indicator === 'dashed',
                            'my-0.5': nestLabel && indicator === 'dashed',
                          }
                        )}
                        style={
                          {
                            '--color-bg': indicatorColor,
                            '--color-border': indicatorColor,
                          } as React.CSSProperties
                        }
                      />
                    )
                  )}
                  <div
                    className={cn(
                      'flex flex-1 justify-between leading-none',
                      nestLabel ? 'items-end' : 'items-center'
                    )}
                  >
                    <div className="grid gap-1.5">
                      {nestLabel ? tooltipLabel : null}
                      <span className="text-muted-foreground">
                        {itemConfig?.label || item.name}
                      </span>
                    </div>
                    {item.value && (
                      <span className="text-foreground font-mono font-medium tabular-nums">
                        {item.value.toLocaleString()}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const ChartLegendImpl = RechartsPrimitive.Legend;

export function ChartLegendContentImpl({
  className,
  hideIcon = false,
  payload = EMPTY_PAYLOAD_LEGEND,
  verticalAlign = 'bottom',
  nameKey,
}: React.ComponentProps<'div'> & {
  hideIcon?: boolean;
  nameKey?: string;
  payload?: Array<{
    color?: string;
    dataKey?: string;
    value?: string;
  }>;
  verticalAlign?: 'top' | 'bottom';
}) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-4',
        verticalAlign === 'top' ? 'pb-3' : 'pt-3',
        className
      )}
    >
      {payload.map((item: { color?: string; dataKey?: string; value?: string }) => {
        const key = `${nameKey || item.dataKey || 'value'}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div
            key={item.value}
            className={cn(
              '[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3'
            )}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: item.color,
                }}
              />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined;
  }

  const payloadPayload =
    'payload' in payload && typeof payload.payload === 'object' && payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (key in payload && typeof payload[key as keyof typeof payload] === 'string') {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config];
}
