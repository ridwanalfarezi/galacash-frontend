import { type RouteConfig, layout, prefix, route } from '@react-router/dev/routes'

export default [
  ...prefix('user', [
    layout('./components/shared/layout/layout.tsx', [
      route('dashboard', './routes/user/dashboard.tsx'),
      route('aju-dana', './routes/user/aju-dana.tsx'),
    ]),
  ]),
  route('sign-in', './routes/sign-in.tsx'),
] satisfies RouteConfig
