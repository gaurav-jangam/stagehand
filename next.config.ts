
import type {NextConfig} from 'next';
require('dotenv').config();
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontendNav: true,
  aggresiveFrontendNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/songs',
        destination: '/dashboard',
        permanent: true,
      },
       {
        source: '/shows',
        destination: '/dashboard/shows',
        permanent: true,
      },
      {
        source: '/assistant',
        destination: '/dashboard/assistant',
        permanent: true,
      }
    ]
  },
};

export default withPWA(nextConfig);
