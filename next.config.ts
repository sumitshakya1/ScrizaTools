import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  transpilePackages: ["lucide-react", "pdf-lib"],
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
