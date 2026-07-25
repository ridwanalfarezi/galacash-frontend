const rawApiUrl = process.env.API_URL;

if (!rawApiUrl) {
  throw new Error('API_URL must be set to the backend origin for this Vercel environment.');
}

const apiUrl = new URL(rawApiUrl);

if (!['http:', 'https:'].includes(apiUrl.protocol)) {
  throw new Error('API_URL must use http:// or https://.');
}

const backendOrigin = apiUrl.toString().replace(/\/+$/, '');

export const config = {
  rewrites: [
    {
      source: '/api/:path*',
      destination: `${backendOrigin}/api/:path*`,
    },
  ],
};
