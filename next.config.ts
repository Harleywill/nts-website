import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deploy runs `next start` directly (never `node .next/standalone/server.js`),
  // so standalone output isn't used - and it caused a real bug: the production
  // server snapshots the public/ directory at boot, so any file uploaded
  // after that (CVs, project/news images, etc.) 404s until the next restart.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ntslimited.org",
        pathname: "/uploads/**",
      },
    ],
  },
  allowedDevOrigins: ["192.168.20.81", "localhost"],
};

export default nextConfig;
