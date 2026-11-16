import type { NextConfig } from 'next';

const config: NextConfig = {
  // A self-contained server in .next/standalone, which the release copies to the server.
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
};

export default config;
