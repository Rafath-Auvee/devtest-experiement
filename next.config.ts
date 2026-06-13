import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    localPatterns: [
      { pathname: "/images/**" },
      { pathname: "/fonts/**" },
    ],
  },
  experimental: {
    optimizePackageImports: ["next/font"],
  },
};

export default nextConfig;
