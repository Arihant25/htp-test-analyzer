import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  // Add experimental features for better Docker performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
