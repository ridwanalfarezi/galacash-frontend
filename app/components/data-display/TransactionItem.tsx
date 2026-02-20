import { CircleArrowDown, CircleArrowUp } from 'lucide-react';

import { formatCurrency } from '~/lib/utils';
import type { TransactionDisplay } from '~/types/domain';

interface TransactionItemProps {
  transaction: TransactionDisplay;
  /**
   * Click handler for viewing transaction details
   */
  onClick?: () => void;
  /**
   * Display variant
   * - 'compact': Shows type label (Pemasukan/Pengeluaran) as title
   * - 'full': Shows description as title with type as subtitle
   */
  variant?: 'compact' | 'full';
}

/**
 * Transaction item component for displaying a single transaction
 *
 * Preserves the exact styling used in dashboard transaction history:
 * - Icon with colored background
 * - Description text
 * - Colored amount with +/- prefix
 */
export function TransactionItem({
  transaction,
  onClick,
  variant = 'compact',
}: TransactionItemProps) {
  const isIncome = transaction.type === 'income';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  const interactiveProps = onClick
    ? {
        onClick,
        onKeyDown: handleKeyDown,
        role: 'button' as const,
        tabIndex: 0 as const,
        style: { cursor: 'pointer' as const },
      }
    : {};

  return (
    <div
      className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
      {...interactiveProps}
    >
      <div className="flex items-center space-x-3">
        <div
          className={`flex items-center justify-center rounded-full p-1 ${
            isIncome ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}
        >
          {isIncome ? <CircleArrowDown className="size-8" /> : <CircleArrowUp className="size-8" />}
        </div>
        <div>
          {variant === 'compact' ? (
            <>
              <h4 className="text-base font-medium">{isIncome ? 'Pemasukan' : 'Pengeluaran'}</h4>
              <h6 className="text-xs text-gray-500">{transaction.description}</h6>
            </>
          ) : (
            <>
              <h4 className="text-base font-medium">{transaction.description}</h4>
              <h6 className="text-xs text-gray-500">{isIncome ? 'Pemasukan' : 'Pengeluaran'}</h6>
            </>
          )}
          {/* Mobile amount display */}
          <h6
            className={`font-medium ${isIncome ? 'text-green-600' : 'text-red-600'} block text-sm md:hidden md:text-base`}
          >
            {isIncome ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </h6>
        </div>
      </div>
      {/* Desktop amount display */}
      <h6
        className={`font-medium ${isIncome ? 'text-green-600' : 'text-red-600'} hidden text-sm md:block md:text-base`}
      >
        {isIncome ? '+' : '-'}
        {formatCurrency(transaction.amount)}
      </h6>
    </div>
  );
}
