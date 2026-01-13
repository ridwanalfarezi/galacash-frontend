export function DashboardSkeleton() {
  return (
    <div className="flex h-screen w-full animate-pulse flex-col gap-6 p-6">
      <div className="h-8 w-48 rounded bg-gray-200"></div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="h-32 rounded-lg bg-gray-200"></div>
        <div className="h-32 rounded-lg bg-gray-200"></div>
        <div className="h-32 rounded-lg bg-gray-200"></div>
      </div>
      <div className="h-64 rounded-lg bg-gray-200"></div>
      <div className="h-48 rounded-lg bg-gray-200"></div>
    </div>
  )
}
