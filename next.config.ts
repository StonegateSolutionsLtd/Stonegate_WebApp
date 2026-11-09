import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
  },
  async redirects() {
    return [
      // The site is moving only: the general pricing page is the moving prices
      { source: '/pricing', destination: '/pricing/moving', permanent: true },
      // Junk removal is discontinued: send its old URLs (Google results, ads, bookmarks) to the closest moving page
      { source: '/pricing/junk-removal', destination: '/pricing/moving', permanent: true },
      { source: '/burnaby-junk-removal', destination: '/burnaby-movers', permanent: true },
      { source: '/junk-removal/:path*', destination: '/', permanent: true },
      { source: '/book-service/:path*', destination: '/', permanent: true },
      // The guides were briefly previewed under /blog: send any shared links to the same guide
      { source: '/blog', destination: '/guides', permanent: true },
      { source: '/blog/:slug', destination: '/guides/:slug', permanent: true },
    ]
  },
};

export default nextConfig;
