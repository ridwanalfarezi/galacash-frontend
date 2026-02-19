import { isRouteErrorResponse, useRouteError } from 'react-router';

import { Button } from '~/components/ui/button';

/**
 * Route-level error boundary component.
 * Catches errors thrown in route loaders/actions and renders a user-friendly UI.
 * Use as the `ErrorBoundary` export in route modules.
 */
export function RouteErrorBoundary() {
  const error = useRouteError();

  let title = 'Terjadi Kesalahan';
  let message = 'Maaf, terjadi kesalahan yang tidak terduga.';
  let status: number | undefined;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    if (error.status === 404) {
      title = 'Halaman Tidak Ditemukan';
      message = 'Halaman yang Anda cari tidak ada atau telah dipindahkan.';
    } else if (error.status === 401) {
      title = 'Tidak Memiliki Akses';
      message = 'Anda tidak memiliki izin untuk mengakses halaman ini.';
    } else if (error.status === 500) {
      title = 'Kesalahan Server';
      message = 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
    } else {
      message = error.statusText || message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      {status && <p className="mb-2 text-6xl font-bold text-gray-200">{status}</p>}
      <h1 className="mb-3 text-2xl font-bold text-gray-900">{title}</h1>
      <p className="mb-6 max-w-md text-gray-500">{message}</p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => window.history.back()}>
          Kembali
        </Button>
        <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
      </div>
    </div>
  );
}
