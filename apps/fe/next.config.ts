import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  turbopack: {
    root: path.resolve(__dirname, '../../'),
  },
  outputFileTracingExcludes: {
    '*': ['sharp', '@img/**'],
  },
  transpilePackages: ['@repo'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'recharts'],
  },
  images: {
    unoptimized: true,
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: process.env.NEXT_PUBLIC_BASEPATH || '/home',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
