import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  transpilePackages: ["lucide-react", "pdf-lib"],
  outputFileTracingRoot: path.join(__dirname),
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // Polyfill/ignore Node.js modules for client-side bundles
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        stream: false,
        crypto: false,
        http: false,
        https: false,
        net: false,
        tls: false,
        zlib: false,
        os: false,
        child_process: false,
      };

      // Handle node: URI scheme imports used by pptxgenjs
      if (webpack) {
        config.plugins.push(
          new webpack.NormalModuleReplacementPlugin(
            /^node:/,
            (resource: any) => {
              const mod = resource.request.replace(/^node:/, "");
              resource.request = mod;
            }
          )
        );
      }
    }
    return config;
  },
};

export default nextConfig;
