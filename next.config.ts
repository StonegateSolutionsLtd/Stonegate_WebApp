import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mapbox GL JS's shared worker pool doesn't survive React Strict Mode's
  // dev-only double-invoke of effects (mount → cleanup → mount creates two
  // Map instances back-to-back and the second never finishes loading tiles).
  // Dev-only; has no effect on production builds.
  reactStrictMode: false,
};

export default nextConfig;
