import { type RouteConfig, layout, prefix, route } from '@react-router/dev/routes'

export default [
  layout('./components/shared/layout/layout.tsx', [
    route('/', './routes/index.tsx'),
    ...prefix('user', [
      route('dashboard', './routes/user/dashboard.tsx'),
      route('kas-kelas', './routes/user/kas-kelas.tsx'),
      route('aju-dana', './routes/user/aju-dana.tsx'),
      route('tagihan-kas', './routes/user/tagihan-kas.tsx'),
      route('settings', './routes/user/settings.tsx'),
    ]),
    ...prefix('bendahara', [
      route('dashboard', './routes/bendahara/dashboard.tsx'),
      route('kas-kelas', './routes/bendahara/kas-kelas.tsx'),
      route('aju-dana', './routes/bendahara/aju-dana.tsx'),
      route('rekap-kas', './routes/bendahara/rekap-kas.tsx'),
      route('settings', './routes/bendahara/settings.tsx'),
    ]),
  ]),
  route('sign-in', './routes/auth/sign-in.tsx'),
] satisfies RouteConfig
