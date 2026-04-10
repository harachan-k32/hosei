import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "release-build-20260410",
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
