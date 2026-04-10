import type { NextConfig } from "next";

const isVercel = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  ...(isVercel ? {} : { distDir: ".next-local-build" }),
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
