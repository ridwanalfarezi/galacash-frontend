import { type RouteConfig, layout, prefix, route } from '@react-router/dev/routes'

export default [
  ...prefix('user', [
    layout('./components/shared/layout.tsx', [route('dashboard', './routes/user/dashboard.tsx')]),
  ]),
] satisfies RouteConfig
