import { CheckIcon, Clock, XIcon } from 'lucide-react'

import { Badge } from '~/components/ui/badge'
import { STATUS_LABELS } from '~/lib/constants'

interface BillStatusBadgeProps {
  status:
    | 'belum_dibayar'
    | 'menunggu_konfirmasi'
    | 'sudah_dibayar'
    | 'Belum Dibayar'
    | 'Menunggu Konfirmasi'
    | 'Sudah Dibayar'
  /**
   * Size variant
   */
  size?: 'sm' | 'md'
}

/**
 * Badge component for displaying cash bill payment status
 *
 * Preserves consistency with other pages:
 * - Red background for belum_dibayar (Unpaid)
 * - Yellow background for menunggu_konfirmasi (Pending)
 * - Green background for sudah_dibayar (Paid)
 */
export function BillStatusBadge({ status, size = 'md' }: BillStatusBadgeProps) {
  // Normalize status to API format
  const normalizedStatus = status.toLowerCase().replace(/ /g, '_') as keyof typeof STATUS_LABELS

  const textSize = size === 'sm' ? 'text-xs' : ''
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'

  switch (normalizedStatus) {
    case 'belum_dibayar':
      return (
        <Badge
          variant="destructive"
          className={`bg-red-50 text-red-700 hover:bg-red-50 ${textSize}`}
        >
          <XIcon className={`mr-1 ${iconSize}`} />
          {STATUS_LABELS.belum_dibayar.labelId}
        </Badge>
      )
    case 'menunggu_konfirmasi':
      return (
        <Badge
          variant="secondary"
          className={`bg-yellow-300 text-yellow-700 hover:bg-yellow-300 ${textSize}`}
        >
          <Clock className={`mr-1 ${iconSize}`} />
          {STATUS_LABELS.menunggu_konfirmasi.labelId}
        </Badge>
      )
    case 'sudah_dibayar':
      return (
        <Badge
          variant="default"
          className={`bg-green-50 text-green-700 hover:bg-green-50 ${textSize}`}
        >
          <CheckIcon className={`mr-1 ${iconSize}`} />
          {STATUS_LABELS.sudah_dibayar.labelId}
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}
