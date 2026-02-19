'use client'

import { ExplorerProvider } from '~/components/shared/explorer/ExplorerContext'
import { KasKelasBase } from '~/components/shared/kas-kelas/KasKelasBase'

interface KasKelasParams {
  type?: 'income' | 'expense'
  [key: string]: unknown
}

export default function UserKasKelasPage() {
  return (
    <div className="p-6">
      <ExplorerProvider<KasKelasParams>
        defaultLimit={25}
        defaultSort={{ key: 'date', direction: 'desc' }}
      >
        <KasKelasBase
          variant="user"
          title="Riwayat Transaksi"
          chartTitle="Visualisasi Keuangan"
          showCreateButton={false}
          exportFilename="kas-kelas"
        />
      </ExplorerProvider>
    </div>
  )
}
