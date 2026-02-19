'use client'

import { ExplorerProvider } from '~/components/shared/explorer/ExplorerContext'
import { KasKelasBase } from '~/components/shared/kas-kelas/KasKelasBase'

interface KasKelasParams {
  type?: 'income' | 'expense'
  [key: string]: unknown
}

export default function BendaharaKasKelasPage() {
  return (
    <div className="p-6">
      <ExplorerProvider<KasKelasParams>
        defaultLimit={25}
        defaultSort={{ key: 'date', direction: 'desc' }}
      >
        <KasKelasBase
          variant="bendahara"
          title="Kelola Transaksi"
          chartTitle="Visualisasi Keuangan"
          showCreateButton={true}
          exportFilename="bendahara-kas-kelas"
        />
      </ExplorerProvider>
    </div>
  )
}
