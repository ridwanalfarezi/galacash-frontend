'use client'

import { AjuDanaBendaharaList } from '~/components/shared/aju-dana/AjuDanaBase'
import { ExplorerProvider } from '~/components/shared/explorer/ExplorerContext'

interface BendaharaAjuDanaParams {
  status?: 'pending' | 'approved' | 'rejected'
  search?: string
  [key: string]: unknown
}

export default function BendaharaAjuDana() {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl">
        <ExplorerProvider<BendaharaAjuDanaParams>
          defaultLimit={25}
          defaultSort={{ key: 'date', direction: 'desc' }}
        >
          <AjuDanaBendaharaList />
        </ExplorerProvider>
      </div>
    </div>
  )
}
