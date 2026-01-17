import { type RouteConfig, layout, prefix, route } from '@react-router/dev/routes'

/**
 * Application routes configuration
 *
 * Note: React Router v7 with @react-router/dev automatically code-splits
 * each route file. The route() helper creates separate chunks for each page.
 *
 * For explicit lazy loading, use the `lazy` property in route config.
 * Currently all routes are automatically code-split by the bundler.
 */
export default [
  // Protected routes with shared layout
  layout('./components/shared/layout/layout.tsx', [
    // Index redirect
    route('/', './routes/index.tsx'),

    // User routes
    ...prefix('user', [
      route('dashboard', './routes/user/dashboard.tsx'),
      route('kas-kelas', './routes/user/kas-kelas.tsx'),
      route('aju-dana', './routes/user/aju-dana.tsx'),
      route('tagihan-kas', './routes/user/tagihan-kas.tsx'),
      route('settings', './routes/user/settings.tsx'),
    ]),

    // Bendahara routes
    ...prefix('bendahara', [
      route('dashboard', './routes/bendahara/dashboard.tsx'),
      route('kas-kelas', './routes/bendahara/kas-kelas.tsx'),
      route('aju-dana', './routes/bendahara/aju-dana.tsx'),
      route('rekap-kas', './routes/bendahara/rekap-kas.tsx'),
      route('rekap-kas/:nim', './routes/bendahara/detail-rekap-kas.tsx'),
      route('settings', './routes/bendahara/settings.tsx'),
    ]),
  ]),

  // Public routes (no layout)
  route('sign-in', './routes/auth/sign-in.tsx'),
] satisfies RouteConfig
