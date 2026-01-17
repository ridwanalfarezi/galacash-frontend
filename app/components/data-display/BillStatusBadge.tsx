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
 * Preserves the exact styling used in tagihan-kas pages:
 * - Red background for belum_dibayar (Unpaid)
 * - Yellow background for menunggu_konfirmasi (Pending)
 * - Green background for sudah_dibayar (Paid)
 */
export function BillStatusBadge({ status, size = 'md' }: BillStatusBadgeProps) {
  // Normalize status to API format
  const normalizedStatus = status.toLowerCase().replace(/ /g, '_') as keyof typeof STATUS_LABELS

  const textSize = size === 'sm' ? 'text-xs' : ''

  switch (normalizedStatus) {
    case 'belum_dibayar':
      return (
        <Badge
          variant="destructive"
          className={`bg-red-100 text-red-700 hover:bg-red-100 ${textSize}`}
        >
          {STATUS_LABELS.belum_dibayar.labelId}
        </Badge>
      )
    case 'menunggu_konfirmasi':
      return (
        <Badge
          variant="secondary"
          className={`bg-yellow-100 text-yellow-700 hover:bg-yellow-100 ${textSize}`}
        >
          {STATUS_LABELS.menunggu_konfirmasi.labelId}
        </Badge>
      )
    case 'sudah_dibayar':
      return (
        <Badge
          variant="default"
          className={`bg-green-100 text-green-700 hover:bg-green-100 ${textSize}`}
        >
          {STATUS_LABELS.sudah_dibayar.labelId}
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}
