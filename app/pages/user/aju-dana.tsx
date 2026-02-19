'use client'

import { useState } from 'react'

import { AjuDanaList, BuatAjuDanaModal } from '~/components/shared/aju-dana/AjuDanaBase'
import { ExplorerProvider } from '~/components/shared/explorer/ExplorerContext'

interface ApplicationParams {
  status?: 'pending' | 'approved' | 'rejected'
  search?: string
  [key: string]: unknown
}

export default function AjuDanaPage() {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <ExplorerProvider<ApplicationParams>
          scope="myApplications"
          defaultLimit={25}
          defaultSort={{ key: 'date', direction: 'desc' }}
        >
          <AjuDanaList
            title="Rekap Pengajuan Anda"
            variant="my"
            showCreateButton
            onOpenModal={() => setIsApplicationModalOpen(true)}
          />
        </ExplorerProvider>

        <ExplorerProvider<ApplicationParams>
          scope="allApplications"
          defaultLimit={25}
          defaultSort={{ key: 'date', direction: 'desc' }}
        >
          <AjuDanaList title="Rekap Pengajuan Dana" variant="all" />
        </ExplorerProvider>

        <BuatAjuDanaModal
          isOpen={isApplicationModalOpen}
          onClose={() => setIsApplicationModalOpen(false)}
        />
      </div>
    </div>
  )
}
