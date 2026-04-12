import { Calendar as CalendarIcon } from 'lucide-react';
import { Link } from 'react-router';

import { Icons } from '~/components/icons';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { formatCurrency } from '~/lib/utils';

interface TagihanCardProps {
  isLoading: boolean;
  hasBills: boolean;
  totalBills: { amount: number; date: Date } | null;
  deadline: Date | null;
  className?: string;
  onPayNow?: () => void;
}

export function TagihanCard({
  isLoading,
  hasBills,
  totalBills,
  deadline,
  className,
  onPayNow,
}: TagihanCardProps) {
  if (isLoading) {
    return (
      <Card className={`gap-2 rounded-4xl border-none bg-gray-200 ${className}`}>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-40" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-4 w-64" />
        </CardFooter>
      </Card>
    );
  }

  if (hasBills && totalBills) {
    return (
      <Card className={`gap-2 rounded-4xl border-none bg-red-700 text-gray-100 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-start gap-2 text-lg font-semibold md:text-2xl xl:text-3xl">
            <Icons.Alert className="size-6" />
            Tagihan Kas Anda
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="size-4" />
            {totalBills.date.toLocaleDateString('id', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}{' '}
            -{' '}
            {deadline?.toLocaleDateString('id', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </div>
          <div className="text-xl font-bold md:text-3xl xl:text-4xl">
            {formatCurrency(totalBills.amount)}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-2">
          <div className="hidden md:block">
            Harap bayar tagihan anda sebelum{' '}
            <span className="font-semibold">
              {deadline?.toLocaleDateString('id', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="mt-4 flex w-full items-center justify-between sm:mt-0 sm:w-auto">
            {onPayNow ? (
              <button
                onClick={onPayNow}
                className="cursor-pointer rounded-lg bg-white/90 px-3 py-1 font-bold text-blue-500 transition-all hover:scale-105 hover:underline active:scale-95"
              >
                Bayar Sekarang
              </button>
            ) : (
              <Link
                to="/user/tagihan-kas"
                className="rounded-lg bg-white/90 px-3 py-1 font-semibold text-blue-500 hover:underline"
              >
                Bayar Sekarang
              </Link>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={`gap-2 rounded-4xl border-none bg-green-600 text-gray-100 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-start gap-2 text-lg font-semibold md:text-2xl xl:text-3xl">
          <Icons.Check className="size-6" />
          Tagihan Lunas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm md:text-base">Tidak ada tagihan yang belum dibayar. Terima kasih!</p>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Link
          to="/user/tagihan-kas"
          className="rounded-lg bg-white/90 px-3 py-1 font-semibold text-blue-500 hover:underline"
        >
          Lihat Riwayat Pembayaran
        </Link>
      </CardFooter>
    </Card>
  );
}
