import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
  },
  async redirects() {
    return [
      // The site is moving only: the general pricing page is the moving prices
      { source: '/pricing', destination: '/pricing/moving', permanent: true },
      // Junk removal is discontinued and has no equivalent page: its old URLs return 410 Gone from proxy.ts, not a redirect
      // The guides were briefly previewed under /blog: send any shared links to the same guide
      { source: '/blog', destination: '/guides', permanent: true },
      { source: '/blog/:slug', destination: '/guides/:slug', permanent: true },
    ]
  },
};

export default nextConfig;
