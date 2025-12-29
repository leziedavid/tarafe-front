import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'http://127.0.0.1:8000',
      },

      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      {
        protocol: 'https',
        hostname: 'security.tarafe.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'ms.cloud.tarafe.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'tarafe.com',
        pathname: '**',
      },
    ],
  },
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
};

export default nextConfig;
