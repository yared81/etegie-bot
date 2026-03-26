/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['etegie-bot'],
  experimental: {
    esmExternals: false
  },
  webpack: (config) => {
    // Handle CSS imports from the etegie-bot package
    config.module.rules.push({
      test: /\.css$/,
      use: ['ignore-loader'],
    });
    
    return config;
  }
};

module.exports = nextConfig;