import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';

/**
 * Skeleton for StatCard component
 * Matches the exact layout of the StatCard for smooth loading transitions
 */
export function StatCardSkeleton() {
  return (
    <Card className="relative overflow-hidden rounded-3xl border-0 shadow-sm">
      <CardContent className="flex flex-row items-center gap-4 p-5">
        {/* Icon skeleton */}
        <Skeleton className="size-12 rounded-full" />
        <div className="flex flex-col gap-1">
          {/* Label skeleton */}
          <Skeleton className="h-4 w-24" />
          {/* Value skeleton */}
          <Skeleton className="h-7 w-32" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Grid of StatCard skeletons for dashboard loading state
 */
export function StatCardsGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for TransactionItem component
 * Matches the exact layout of transaction history items
 */
export function TransactionItemSkeleton() {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-3">
      <div className="flex flex-col gap-1">
        {/* Description */}
        <Skeleton className="h-4 w-40" />
        {/* Date */}
        <Skeleton className="h-3 w-24" />
      </div>
      {/* Amount */}
      <Skeleton className="h-5 w-20" />
    </div>
  );
}

/**
 * List of TransactionItem skeletons
 */
export function TransactionListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <TransactionItemSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for table rows (used in kas-kelas, aju-dana, etc.)
 */
export function TableRowSkeleton({ cols }: { cols: number[] }) {
  return (
    <tr className="border-b border-gray-300">
      {cols.map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full max-w-24" />
        </td>
      ))}
    </tr>
  );
}

/**
 * Multiple table row skeletons
 */
export function TableBodySkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  const cols = Array.from<number>({ length: columns })
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} cols={cols} />
      ))}
    </>
  );
}

/**
 * Skeleton for mobile card view items (used in responsive tables)
 */
export function MobileCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Date */}
        <Skeleton className="h-3 w-20" />
        {/* Badge */}
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      {/* Title */}
      <Skeleton className="h-5 w-3/4" />
      {/* Metadata */}
      <Skeleton className="h-3 w-1/2" />
      <div className="mt-2 flex items-center justify-between">
        {/* Amount */}
        <Skeleton className="h-5 w-24" />
        {/* Action button */}
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
  );
}

/**
 * Multiple mobile card skeletons
 */
export function MobileCardListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <MobileCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for financial pie chart
 */
export function ChartSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Title */}
      <Skeleton className="h-6 w-32" />
      {/* Chart circle */}
      <Skeleton className="size-48 rounded-full" />
      {/* Legend items */}
      <div className="flex flex-wrap justify-center gap-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

/**
 * Full page skeleton for dashboard
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Stat cards */}
      <StatCardsGridSkeleton count={3} />

      {/* Transaction history card */}
      <Card className="rounded-4xl border-0">
        <CardHeader>
          <Skeleton className="h-7 w-48" />
        </CardHeader>
        <CardContent>
          <TransactionListSkeleton count={5} />
        </CardContent>
      </Card>
    </div>
  );
}

const KAS_KELAS_HEADER_COLS = new Array(5).fill(0)

/**
 * Full page skeleton for kas-kelas type pages
 */
export function KasKelasSkeleton() {
  return (
    <div className="space-y-8 p-6">
      {/* Charts section */}
      <Card className="rounded-4xl border-0">
        <CardHeader>
          <Skeleton className="h-7 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
        </CardContent>
      </Card>

      {/* Table section */}
      <Card className="rounded-4xl border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-7 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded" />
            <Skeleton className="h-9 w-24 rounded" />
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop table */}
          <div className="hidden sm:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  {KAS_KELAS_HEADER_COLS.map((_, i) => (
                    <th key={i} className="px-4 py-3">
                      <Skeleton className="h-4 w-20" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <TableBodySkeleton rows={5} columns={5} />
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="sm:hidden">
            <MobileCardListSkeleton count={3} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Skeleton for Filter and Action buttons bar
 */
export function FilterBarSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Skeleton className="h-8 w-48" /> {/* Title or Left side */}
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24 rounded" />
        <Skeleton className="h-9 w-24 rounded" />
        <Skeleton className="hidden h-9 w-24 rounded sm:block" />
      </div>
    </div>
  );
}

/**
 * Skeleton structure for a generic data card (used in AjuDana, TagihanKas)
 */
export function DataCardSkeleton({ titleWidth = 'w-48' }: { titleWidth?: string }) {
  return (
    <Card className="rounded-4xl border-0">
      <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className={`h-8 ${titleWidth} md:text-2xl`} />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20 rounded lg:w-24" />
          <Skeleton className="h-9 w-20 rounded lg:w-24" />
          <Skeleton className="hidden h-9 w-24 rounded sm:block" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop table */}
        <div className="hidden sm:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300">
                {Array.from({ length: 6 }).map((_, i) => (
                  <th key={i} className="px-4 py-3 text-left">
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <TableBodySkeleton rows={5} columns={6} />
            </tbody>
          </table>
        </div>
        {/* Mobile cards */}
        <div className="sm:hidden">
          <MobileCardListSkeleton count={3} />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton for user/aju-dana page (Double card layout)
 */
export function AjuDanaUserSkeleton() {
  return (
    <div className="mx-auto max-w-360 space-y-8 p-6">
      <DataCardSkeleton titleWidth="w-56" />
      <DataCardSkeleton titleWidth="w-56" />
    </div>
  );
}

/**
 * Skeleton for bendahara/aju-dana page (Single card layout)
 */
export function AjuDanaBendaharaSkeleton() {
  return (
    <div className="mx-auto max-w-360 p-6">
      <DataCardSkeleton titleWidth="w-56" />
    </div>
  );
}

/**
 * Skeleton for Tagihan Kas page
 */
export function TagihanKasSkeleton() {
  return (
    <div className="mx-auto max-w-360 p-6">
      <DataCardSkeleton titleWidth="w-40" />
    </div>
  );
}

const REKAP_KAS_TABLE_ROWS = new Array(8).fill(0)
const REKAP_KAS_MOBILE_CARDS = new Array(4).fill(0)

/**
 * Skeleton for Rekap Kas page (complex table)
 */
export function RekapKasSkeleton() {
  return (
    <div className="p-6">
      <Card className="mx-auto max-w-360 rounded-4xl border-0">
        <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-8 w-48 md:text-2xl" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-full rounded sm:w-64" /> {/* Search */}
            <Skeleton className="h-10 w-24 rounded" /> {/* Export */}
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden sm:block">
            <div className="mb-4 flex space-x-4 border-b pb-2">
              <Skeleton className="h-4 w-20" /> {/* NIM */}
              <Skeleton className="h-4 w-48" /> {/* Nama */}
              <Skeleton className="h-4 w-16" /> {/* Month 1 */}
              <Skeleton className="h-4 w-16" /> {/* Month 2 */}
              <Skeleton className="h-4 w-16" /> {/* Month 3 */}
              <Skeleton className="h-4 w-16" /> {/* Month 4 */}
              <Skeleton className="h-4 w-32" /> {/* Total */}
            </div>
            <div className="space-y-4">
              {REKAP_KAS_TABLE_ROWS.map((_, i) => (
                <div key={i} className="flex space-x-4 border-b pb-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
          {/* Mobile Cards */}
          <div className="space-y-4 sm:hidden">
            {REKAP_KAS_MOBILE_CARDS.map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 p-4">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <div className="mt-4 flex justify-between gap-2">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <div className="mt-4 flex justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Skeleton for Settings Page
 */
export function SettingsSkeleton() {
  return (
    <div className="p-8">
      <Skeleton className="mb-4 h-8 w-40" />
      <div className="bg-card flex flex-col gap-15 rounded-2xl p-10 shadow-lg md:flex-row md:gap-10">
        {/* Profile Section */}
        <div className="flex-1 space-y-8">
          <div className="flex flex-col items-center gap-y-11">
            <Skeleton className="size-64 rounded-full" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>

        <div className="hidden w-px bg-gray-200 md:block" />

        {/* Password Section */}
        <div className="flex-1 space-y-4">
          <Skeleton className="mb-6 h-7 w-48" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="mt-8 space-y-2">
            <Skeleton className="ml-auto h-4 w-3/4" />
            <Skeleton className="ml-auto h-4 w-1/2" />
          </div>
          <div className="flex justify-end pt-4">
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
