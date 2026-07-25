import { deploymentEnv, routes, type VercelConfig } from '@vercel/config/v1';

export const config: VercelConfig = {
  rewrites: [
    routes.rewrite('/api/:path*', `${deploymentEnv('API_URL')}/api/:path*`),
  ],
};
