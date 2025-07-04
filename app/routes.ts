import { type RouteConfig, layout, prefix, route } from '@react-router/dev/routes'

export default [
  route('/', './routes/index.tsx'),
  ...prefix('user', [
    layout('./components/shared/layout/layout.tsx', [
      route('dashboard', './routes/user/dashboard.tsx'),
      route('kas-kelas', './routes/user/kas-kelas.tsx'),
      route('aju-dana', './routes/user/aju-dana.tsx'),
      route('settings', './routes/user/settings.tsx'),
    ]),
  ]),
  route('sign-in', './routes/sign-in.tsx'),
] satisfies RouteConfig
