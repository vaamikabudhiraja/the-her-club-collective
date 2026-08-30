import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow product images served from Shopify's CDN to be optimized by next/image.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
