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

  switch (status) {
    case 'pending':
      return (
        <Badge className={`bg-yellow-300 text-yellow-700 ${textSize}`}>
          <Clock className="h-4 w-4" />
          {STATUS_LABELS.pending.labelId}
        </Badge>
      )
    case 'approved':
      return (
        <Badge className={`bg-green-50 text-green-700 ${textSize}`}>
          <CheckIcon className="h-4 w-4" />
          {STATUS_LABELS.approved.labelId}
        </Badge>
      )
    case 'rejected':
      return (
        <Badge className={`bg-red-50 text-red-700 ${textSize}`}>
          <XIcon className="h-4 w-4" />
          {STATUS_LABELS.rejected.labelId}
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}
