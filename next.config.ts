import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['*.lvh.me'],
  cacheComponents: true,
};

export default nextConfig;
