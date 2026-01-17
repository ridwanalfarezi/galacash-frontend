import { Icons } from '~/components/icons'
import { Badge } from '~/components/ui/badge'
import { TRANSACTION_TYPES } from '~/lib/constants'

interface TransactionTypeBadgeProps {
  type: 'income' | 'expense'
  /**
   * Size variant
   */
  size?: 'sm' | 'md'
}

/**
 * Badge component for displaying transaction type (Pemasukan/Pengeluaran)
 *
 * Preserves the exact styling used in kas-kelas transaction table:
 * - Green background for income
 * - Red background for expense
 * - Icon + text
 */
export function TransactionTypeBadge({ type, size = 'md' }: TransactionTypeBadgeProps) {
  const config = TRANSACTION_TYPES[type]
  const isIncome = type === 'income'

  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  const textSize = size === 'sm' ? 'text-sm' : 'md:text-base'

  return (
    <Badge className={`${config.bgColor} font-normal ${config.textColor} ${textSize}`}>
      {isIncome ? (
        <Icons.ArrowUpCircle className={iconSize} />
      ) : (
        <Icons.ArrowDownCircle className={iconSize} />
      )}
      {config.label}
    </Badge>
  )
}
