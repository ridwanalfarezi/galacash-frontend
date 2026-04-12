'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Receipt } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import {
  BillStatusBadge,
  EmptyState,
  MobileCardListSkeleton,
  TableBodySkeleton,
} from '~/components/data-display';
import { BatchPaymentBar } from '~/components/modals/BatchPaymentBar';
import { BatchPaymentModal } from '~/components/modals/BatchPaymentModal';
import { DetailTagihanKas } from '~/components/modals/DetailTagihanKas';
import {
  DataCard,
  DataCardContainer,
  DataMobileFilters,
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
} from '~/components/shared/data-table/DataTable';
import { DataTablePagination } from '~/components/shared/data-table/DataTablePagination';
import { ExplorerProvider, useExplorer } from '~/components/shared/explorer/ExplorerContext';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { cashBillQueries } from '~/lib/queries/cash-bill.queries';
import { formatCurrency, formatDate, formatMonthYear } from '~/lib/utils';

interface TagihanKas {
  id: string;
  month: string;
  status: 'Belum Dibayar' | 'Menunggu Konfirmasi' | 'Sudah Dibayar';
  billId: string;
  dueDate: string;
  totalAmount: number;
  name: string;
  kasKelas: number;
  biayaAdmin: number;
  paymentProofUrl?: string | null;
}

interface TagihanKasParams {
  status?: 'belum_dibayar' | 'menunggu_konfirmasi' | 'sudah_dibayar';
  search?: string;
  [key: string]: unknown;
}

function TagihanKasContent() {
  const { search, debouncedSearch, setSearch, filters, setFilters, sort, setSort, pagination } =
    useExplorer<TagihanKasParams>();
  const [selectedTagihan, setSelectedTagihan] = useState<TagihanKas | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Multi-select state
  const [selectedBillIds, setSelectedBillIds] = useState<Set<string>>(new Set());
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  // Fetch cash bills
  const { data: response, isLoading } = useQuery({
    ...cashBillQueries.my({
      status: filters.status as
        | 'belum_dibayar'
        | 'menunggu_konfirmasi'
        | 'sudah_dibayar'
        | undefined,
      search: debouncedSearch || undefined,
      sortBy: (sort?.key as 'dueDate' | 'totalAmount' | 'month' | 'status') || 'dueDate',
      sortOrder: (sort?.direction as 'asc' | 'desc') || 'desc',
      page: pagination.page,
      limit: pagination.limit,
    }),
  });

  const tagihanKasList: TagihanKas[] = useMemo(() => {
    const bills = response?.data;
    if (!Array.isArray(bills)) return [];

    return bills.map((bill: Record<string, unknown>) => {
      // Construct date from month (1-12) and year values
      const monthNum = Number(bill.month) || 1;
      const yearNum = Number(bill.year) || new Date().getFullYear();
      const monthDate = new Date(yearNum, monthNum - 1); // monthNum - 1 because JS months are 0-indexed
      const monthName = formatMonthYear(monthDate);

      const dueDateFormatted = bill.dueDate ? formatDate(bill.dueDate as string) : '';

      let displayStatus: TagihanKas['status'] = 'Belum Dibayar';
      if (bill.status === 'sudah_dibayar') displayStatus = 'Sudah Dibayar';
      else if (bill.status === 'menunggu_konfirmasi') displayStatus = 'Menunggu Konfirmasi';

      return {
        id: String(bill.id || ''),
        month: monthName,
        status: displayStatus,
        billId: String(bill.billId || ''),
        dueDate: dueDateFormatted,
        totalAmount: Number(bill.totalAmount || 0),
        name: ((bill.user as Record<string, unknown>)?.name as string) || '',
        kasKelas: Number(bill.kasKelas || 0),
        biayaAdmin: Number(bill.biayaAdmin || 0),
        paymentProofUrl: (bill.paymentProofUrl as string) || null,
      };
    });
  }, [response?.data]);

  // Selectable bills (only belum_dibayar)
  const selectableBills = useMemo(
    () => tagihanKasList.filter((t) => t.status === 'Belum Dibayar'),
    [tagihanKasList]
  );

  // Selected bills data for the batch modal
  const selectedBillsData = useMemo(
    () => tagihanKasList.filter((t) => selectedBillIds.has(t.id)),
    [tagihanKasList, selectedBillIds]
  );

  const selectedTotalAmount = useMemo(
    () => selectedBillsData.reduce((sum, b) => sum + b.totalAmount, 0),
    [selectedBillsData]
  );

  // Are all selectable bills on this page selected?
  const allSelectableSelected =
    selectableBills.length > 0 && selectableBills.every((b) => selectedBillIds.has(b.id));

  const handleToggleBill = useCallback((id: string) => {
    setSelectedBillIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(() => {
    if (allSelectableSelected) {
      // Deselect all on this page
      setSelectedBillIds((prev) => {
        const next = new Set(prev);
        for (const b of selectableBills) {
          next.delete(b.id);
        }
        return next;
      });
    } else {
      // Select all selectable on this page
      setSelectedBillIds((prev) => {
        const next = new Set(prev);
        for (const b of selectableBills) {
          next.add(b.id);
        }
        return next;
      });
    }
  }, [allSelectableSelected, selectableBills]);

  const handleClearSelection = useCallback(() => {
    setSelectedBillIds(new Set());
  }, []);

  const handleOpenDetail = (tagihan: TagihanKas) => {
    // If bill is selectable (unpaid), toggle selection instead of opening detail
    // This provides a massive click target for the user as requested
    if (tagihan.status === 'Belum Dibayar') {
      handleToggleBill(tagihan.id);
      return;
    }

    // For other statuses (Sudah Dibayar, Menunggu Konfirmasi), open detail normally
    setSelectedTagihan(tagihan);
    setIsDetailModalOpen(true);
  };

  const handleBatchPaySuccess = useCallback(() => {
    setSelectedBillIds(new Set());
  }, []);

  return (
    <Card className="overflow-hidden rounded-4xl border-0 shadow-lg shadow-gray-100">
      <CardHeader className="border-b border-gray-50">
        <CardTitle className="text-xl font-bold text-gray-900 md:text-2xl">
          Tagihan Kas Anda
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 p-0 sm:p-6">
        <div className="px-6 pt-6 sm:px-0 sm:pt-0">
          <DataMobileFilters
            search={search}
            onSearchChange={setSearch}
            placeholder="Cari ID tagihan, bulan, atau nominal..."
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block">
          <DataTable>
            <DataTableHeader>
              <DataTableRow>
                {/* Checkbox column */}
                <DataTableHead className="w-12">
                  {selectableBills.length > 0 && (
                    <Checkbox
                      checked={allSelectableSelected}
                      onCheckedChange={handleToggleAll}
                      aria-label="Pilih semua tagihan"
                    />
                  )}
                </DataTableHead>
                <DataTableHead sortKey="month" currentSort={sort} onSort={setSort}>
                  Bulan
                </DataTableHead>
                <DataTableHead
                  filterValue={filters.status}
                  onFilterChange={(v) =>
                    setFilters({
                      status: v as 'belum_dibayar' | 'menunggu_konfirmasi' | 'sudah_dibayar',
                    })
                  }
                  filterOptions={[
                    { label: 'Semua Status', value: '' },
                    { label: 'Belum Dibayar', value: 'belum_dibayar' },
                    { label: 'Menunggu Konfirmasi', value: 'menunggu_konfirmasi' },
                    { label: 'Sudah Dibayar', value: 'sudah_dibayar' },
                  ]}
                  filterOnly
                >
                  Status
                </DataTableHead>
                <DataTableHead
                  filterValue={search}
                  onFilterChange={setSearch}
                  filterPlaceholder="Cari ID tagihan, bulan, atau nominal..."
                >
                  ID Tagihan
                </DataTableHead>
                <DataTableHead sortKey="dueDate" currentSort={sort} onSort={setSort}>
                  Tenggat Waktu
                </DataTableHead>
                <DataTableHead
                  sortKey="amount"
                  currentSort={sort}
                  onSort={setSort}
                  className="text-right"
                >
                  Total Tagihan
                </DataTableHead>
                <DataTableHead className="w-10"></DataTableHead>
              </DataTableRow>
            </DataTableHeader>
            <DataTableBody>
              {isLoading ? (
                <TableBodySkeleton columns={7} />
              ) : tagihanKasList.length > 0 ? (
                tagihanKasList.map((t) => {
                  const isSelectable = t.status === 'Belum Dibayar';
                  const isSelected = selectedBillIds.has(t.id);

                  return (
                    <DataTableRow
                      key={t.id}
                      onClick={() => handleOpenDetail(t)}
                      className={`cursor-pointer font-medium transition-all ${
                        isSelected
                          ? 'bg-blue-50 ring-1 inset-shadow-sm ring-blue-100 hover:bg-blue-100'
                          : 'hover:bg-gray-50/50'
                      }`}
                    >
                      {/* Checkbox cell */}
                      <DataTableCell
                        onClick={(e: React.MouseEvent) => {
                          if (isSelectable) {
                            e.stopPropagation();
                            handleToggleBill(t.id);
                          }
                        }}
                      >
                        {isSelectable && (
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleToggleBill(t.id)}
                            aria-label={`Pilih tagihan ${t.month}`}
                          />
                        )}
                      </DataTableCell>
                      <DataTableCell className="text-gray-900">{t.month}</DataTableCell>
                      <DataTableCell>
                        <BillStatusBadge status={t.status} size="sm" />
                      </DataTableCell>
                      <DataTableCell className="font-mono text-xs text-gray-400">
                        {t.billId}
                      </DataTableCell>
                      <DataTableCell className="text-gray-500">{t.dueDate}</DataTableCell>
                      <DataTableCell className="text-right font-bold text-blue-500">
                        {formatCurrency(t.totalAmount)}
                      </DataTableCell>
                      <DataTableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-gray-300"
                          onClick={(e) => {
                            // Specifically allow opening detail even for unpaid bills via the chevron
                            if (t.status === 'Belum Dibayar') {
                              e.stopPropagation();
                              setSelectedTagihan(t);
                              setIsDetailModalOpen(true);
                            }
                          }}
                        >
                          <ChevronRight className="size-4" />
                        </Button>
                      </DataTableCell>
                    </DataTableRow>
                  );
                })
              ) : (
                <DataTableRow>
                  <DataTableCell colSpan={7} className="h-48 text-center text-gray-400">
                    <EmptyState
                      icon={Receipt}
                      title="Tidak ada tagihan"
                      description="Gunakan filter lain atau tunggu tagihan bulan berikutnya"
                    />
                  </DataTableCell>
                </DataTableRow>
              )}
            </DataTableBody>
          </DataTable>
        </div>

        {/* Mobile Cards */}
        <DataCardContainer className="px-6 pb-6 sm:px-0 sm:pb-0">
          {isLoading ? (
            <MobileCardListSkeleton count={5} />
          ) : tagihanKasList.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="Tidak ada tagihan"
              description="Belum ada data riwayat tagihan"
            />
          ) : (
            tagihanKasList.map((t) => {
              const isSelectable = t.status === 'Belum Dibayar';
              const isSelected = selectedBillIds.has(t.id);

              return (
                <DataCard
                  key={t.id}
                  onClick={() => handleOpenDetail(t)}
                  className={`transition-all ${
                    isSelected
                      ? 'scale-[1.02] bg-blue-50 shadow-md ring-2 ring-blue-500'
                      : 'hover:border-blue-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {isSelectable && (
                        <div
                          className="pt-0.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleBill(t.id);
                          }}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleToggleBill(t.id)}
                            aria-label={`Pilih tagihan ${t.month}`}
                          />
                        </div>
                      )}
                      <div className="space-y-1">
                        <h3 className="leading-tight font-bold text-gray-900">{t.month}</h3>
                        <p className="font-mono text-xs text-gray-400">{t.billId}</p>
                      </div>
                    </div>
                    <BillStatusBadge status={t.status} size="sm" />
                  </div>

                  <div className="mt-1 flex items-center justify-between border-t border-gray-50 pt-2">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Tenggat</p>
                      <p className="text-xs font-medium text-gray-600">{t.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Total</p>
                      <p className="mt-0.5 leading-none font-bold text-blue-500">
                        {formatCurrency(t.totalAmount)}
                      </p>
                    </div>
                  </div>
                </DataCard>
              );
            })
          )}
        </DataCardContainer>

        <div className="px-6 pb-6 sm:px-0 sm:pb-0">
          <DataTablePagination
            total={response?.total || 0}
            totalPages={response?.totalPages || 1}
          />
        </div>
      </CardContent>

      {selectedTagihan && (
        <DetailTagihanKas
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedTagihan(null);
          }}
          tagihan={selectedTagihan}
        />
      )}

      {/* Batch Payment Bar */}
      <BatchPaymentBar
        selectedCount={selectedBillIds.size}
        totalAmount={selectedTotalAmount}
        onPayClick={() => setIsBatchModalOpen(true)}
        onClearSelection={handleClearSelection}
      />

      {/* Batch Payment Modal */}
      <BatchPaymentModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        bills={selectedBillsData}
        onSuccess={handleBatchPaySuccess}
      />
    </Card>
  );
}

export default function UserTagihanKasPage() {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl">
        <ExplorerProvider<TagihanKasParams>
          defaultLimit={25}
          defaultSort={{ key: 'dueDate', direction: 'desc' }}
        >
          <TagihanKasContent />
        </ExplorerProvider>
      </div>
    </div>
  );
}
