import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  /**
   * Icon component to display (e.g., from lucide-react)
   */
  icon: LucideIcon
  /**
   * Main title text
   */
  title: string
  /**
   * Description text below the title
   */
  description: string
  /**
   * Optional action element (e.g., a button)
   */
  action?: React.ReactNode
  /**
   * Optional custom className for the container
   */
  className?: string
}

/**
 * Empty state component for displaying when no data is available
 *
 * Preserves the exact styling used across the app:
 * - Centered flex layout
 * - Gray icon
 * - Gray-900 title
 * - Gray-500 description
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-10 text-center ${className}`}>
      <div className="mb-4 rounded-full bg-gray-50 p-4 text-gray-400">
        <Icon className="size-12" />
      </div>
      <h3 className="mb-1 text-lg font-bold text-gray-900">{title}</h3>
      <p className="mx-auto max-w-xs text-sm text-gray-500">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
