import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
  },
  // The site leads with moving: the general pricing page is the moving prices
  async redirects() {
    return [
      { source: '/pricing', destination: '/pricing/moving', permanent: true },
    ]
  },
};

export default nextConfig;
