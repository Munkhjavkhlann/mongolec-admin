import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mongolec.s3.us-west-004.backblazeb2.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.backblazeb2.com',
      },
    ],
  },
};

export default nextConfig;
