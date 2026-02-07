/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Node.js polyfill fallbacks for Solana web3.js
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    return config;
  },
  // Transpile the workspace protocol package
  transpilePackages: ["@percolator/protocol"],
};

export default nextConfig;
