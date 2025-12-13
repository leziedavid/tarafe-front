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
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // https://ms.cloud.tarafe.com/api/v1/homepage-data



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
