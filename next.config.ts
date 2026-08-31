import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow product images served from Shopify's CDN to be optimized by next/image.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
        // NOTE: no `search` restriction — Shopify image URLs always carry a
        // `?v=<version>` query string, and `search: ""` would reject them (400).
      },
    ],
  },
};

export default nextConfig;
