import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  webpack: {
    // Force webpack instead of Turbopack
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  allowedDevOrigins: ["192.168.20.81", "localhost"],
};

export default nextConfig;
