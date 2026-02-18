/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure API routes are not statically optimized
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack(config) {
    // Find existing SVG rule
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );

    // Exclude SVG from default file loader
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    // Add SVGR
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default nextConfig;
