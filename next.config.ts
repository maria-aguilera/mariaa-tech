import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/maria-aguilera/portfolio-assets/**",
      },
      {
        protocol: "https",
        hostname: "maria-aguilera.github.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
