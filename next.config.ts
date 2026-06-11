import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "nevilletuckerservices.co.uk",
        pathname: "/uploads/**",
      },
    ],
  },
  allowedDevOrigins: ["192.168.20.81", "localhost"],
};

export default nextConfig;
