import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        hostname: "cdn.pixabay.com",
        protocol: "https",
        port: ''
      },
      {
        hostname: "accurate-wildebeest-88.convex.cloud",
        protocol: "https",
        port: ''
      },
    ]
  }
};

export default nextConfig;
