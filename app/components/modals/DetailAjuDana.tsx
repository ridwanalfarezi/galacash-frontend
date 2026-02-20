'use client';

import { useQuery } from '@tanstack/react-query';
import { File } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { fundApplicationQueries } from '~/lib/queries/fund-application.queries';
import { formatCurrency, getFilenameFromUrl } from '~/lib/utils';

interface Application {
  id: string;
  date: string;
  purpose: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  amount: number;
  applicant: string;
  description?: string;
  attachment?: string;
}

interface DetailAjuDanaModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
}

export function DetailAjuDanaModal({ isOpen, onClose, application }: DetailAjuDanaModalProps) {
  const { data: detailData } = useQuery(fundApplicationQueries.detail(application.id));

  const handleOpenAttachment = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation();
    const attachmentUrl = detailData?.attachmentUrl || application.attachment;
    if (attachmentUrl) {
      window.open(attachmentUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl sm:max-w-2xl"
        style={{ scrollbarWidth: 'none' }}
      >
        <DialogHeader className="text-left">
          <DialogTitle className="text-2xl font-semibold sm:text-3xl">Detail Pengajuan</DialogTitle>
        </DialogHeader>

        <div className="min-w-0 space-y-4">
          <div className="space-y-1">
            <Label className="text-lg font-normal sm:text-xl">Keperluan</Label>
            <Input value={application.purpose} readOnly />
          </div>

          <div className="space-y-1">
            <Label className="text-lg font-normal sm:text-xl">Deskripsi</Label>
            <Textarea value={application.description || application.purpose} readOnly />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-lg font-normal sm:text-xl">Kategori</Label>
              <Input value={application.category} readOnly />
            </div>

            <div className="space-y-1">
              <Label className="text-lg font-normal sm:text-xl">Nominal</Label>
              <Input value={formatCurrency(application.amount)} readOnly />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-lg font-normal sm:text-xl">Lampiran</Label>
            <div
              {...(detailData?.attachmentUrl || application.attachment
                ? {
                    onClick: handleOpenAttachment,
                    onKeyDown: (e: React.KeyboardEvent) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOpenAttachment();
                      }
                    },
                    role: 'button' as const,
                    tabIndex: 0 as const,
                  }
                : {})}
              className={`flex w-full items-center justify-between rounded-md border-2 px-3 py-2 transition-colors ${
                detailData?.attachmentUrl || application.attachment
                  ? 'cursor-pointer border-gray-500 hover:border-blue-500 hover:bg-blue-50'
                  : 'cursor-default border-gray-300 bg-gray-100'
              }`}
            >
              <span
                className={`truncate ${
                  detailData?.attachmentUrl || application.attachment
                    ? 'text-gray-900 hover:text-blue-600'
                    : 'text-gray-500'
                }`}
              >
                {detailData?.attachmentUrl
                  ? getFilenameFromUrl(detailData.attachmentUrl)
                  : application.attachment
                    ? getFilenameFromUrl(application.attachment)
                    : 'Tidak ada lampiran'}
              </span>
              <File
                className={`h-5 w-5 ${
                  detailData?.attachmentUrl || application.attachment
                    ? 'text-gray-900 hover:text-blue-600'
                    : 'text-gray-400'
                }`}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={onClose} className="w-full px-10 py-2 md:w-auto">
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
