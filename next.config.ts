import type { NextConfig } from "next";

const isVercel = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  ...(isVercel ? {} : { distDir: "release-build-20260410" }),
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
