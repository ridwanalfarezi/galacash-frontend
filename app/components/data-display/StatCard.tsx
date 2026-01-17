import type React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

type StatCardVariant = 'blue' | 'green' | 'red'

interface StatCardProps {
  /**
   * Icon component to display in the header
   */
  icon: React.ReactNode
  /**
   * Main title of the card (e.g., "Total Saldo")
   */
  title: string
  /**
   * Label for the value (e.g., "Saldo Efektif")
   */
  label: string
  /**
   * Formatted value to display (already formatted as string, e.g., "Rp 1.000.000")
   */
  value: string
  /**
   * Color variant for the card
   */
  variant: StatCardVariant
}

/**
 * Stat card component for displaying financial metrics
 *
 * Preserves the exact styling used in the dashboard:
 * - Rounded-4xl corners
 * - No border
 * - Color-coded backgrounds
 */
export function StatCard({ icon, title, label, value, variant }: StatCardProps) {
  const variantStyles: Record<StatCardVariant, { card: string; value: string }> = {
    blue: {
      card: 'border-blue-200 bg-blue-50',
      value: 'text-blue-600',
    },
    green: {
      card: 'border-green-200 bg-green-50',
      value: 'text-green-600',
    },
    red: {
      card: 'border-red-200 bg-red-50',
      value: 'text-red-600',
    },
  }

  const styles = variantStyles[variant]

  return (
    <Card className={`gap-4 rounded-4xl border-none ${styles.card}`}>
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900 md:text-2xl xl:text-3xl">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-1 text-base font-semibold">{label}</div>
        <div className={`text-xl font-bold md:text-3xl xl:text-4xl ${styles.value}`}>{value}</div>
      </CardContent>
    </Card>
  )
}
