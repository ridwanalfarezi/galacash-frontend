import { CheckIcon, Clock, XIcon } from 'lucide-react'

import { Badge } from '~/components/ui/badge'
import { STATUS_LABELS } from '~/lib/constants'

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected'
  /**
   * Size variant
   */
  size?: 'sm' | 'md'
}

/**
 * Badge component for displaying fund application status
 *
 * Preserves the exact styling used in aju-dana pages:
 * - Yellow background for pending
 * - Green background for approved
 * - Red background for rejected
 */
export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const textSize = size === 'sm' ? 'text-xs' : 'md:text-sm'
  const iconSize = size === 'sm' ? 'size-3' : 'size-4'

  switch (status) {
    case 'pending':
      return (
        <Badge
          className={`border-amber-200 bg-amber-100 text-amber-700 shadow-none hover:bg-amber-200 ${textSize}`}
        >
          <Clock className={`mr-1 ${iconSize}`} />
          {STATUS_LABELS.pending.labelId}
        </Badge>
      )
    case 'approved':
      return (
        <Badge
          className={`border-emerald-100 bg-emerald-50 text-emerald-700 shadow-none hover:bg-emerald-100 ${textSize}`}
        >
          <CheckIcon className={`mr-1 ${iconSize}`} />
          {STATUS_LABELS.approved.labelId}
        </Badge>
      )
    case 'rejected':
      return (
        <Badge
          className={`border-rose-100 bg-rose-50 text-rose-700 shadow-none hover:bg-rose-100 ${textSize}`}
        >
          <XIcon className={`mr-1 ${iconSize}`} />
          {STATUS_LABELS.rejected.labelId}
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}
