import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false
    }
    return config
  },
  /* config options here */
  transpilePackages: ['pdfjs-dist']
};

export default nextConfig;
