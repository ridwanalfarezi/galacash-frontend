import KasKelasPage from '~/pages/user/kas-kelas'

export function meta() {
  return [{ title: 'GalaCash | Kas Kelas' }]
}

export async function clientLoader() {
  return new Promise<{ hydrated: boolean }>((resolve) => {
    setTimeout(() => {
      resolve({ hydrated: true })
    }, 100)
  })
}

clientLoader.hydrate = true

export function HydrateFallback() {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-[1440px] space-y-8">
        {/* Chart Card Skeleton */}
        <div className="relative rounded-4xl border-0 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <div className="h-8 w-64 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="flex justify-center">
              <div className="h-[350px] w-[350px] animate-pulse rounded-full bg-gray-200"></div>
            </div>
            <div className="flex justify-center">
              <div className="h-[350px] w-[350px] animate-pulse rounded-full bg-gray-200"></div>
            </div>
          </div>
        </div>

        <div className="rounded-4xl border-0 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                <div className="h-6 w-20 animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function KasKelas() {
  return <KasKelasPage />
}
