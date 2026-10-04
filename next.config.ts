import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.rbxcdn.com",
      },
      {
        protocol: "https",
        hostname: "www.roblox.com",
      },
    ],
  },
};

export default nextConfig;
