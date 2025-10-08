import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "src"),
      "@styles": path.resolve(__dirname, "undyne/styles"),
      "@undyne": path.resolve(__dirname, "undyne"),
      undyne: path.resolve(__dirname, "undyne"), // for "undyne/*" bare imports
    };
    return config;
  },
  experimental: {
    // turbopack: {
    //   enable: true,
    // },
  },
};

export default nextConfig;
