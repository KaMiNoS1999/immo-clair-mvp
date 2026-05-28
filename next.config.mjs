/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        "**/node_modules/**",
        "**/.next/**",
        "**/.tools/**",
        "**/.npm-cache/**",
        "**/.next-swc-cache/**"
      ]
    };

    return config;
  }
};

export default nextConfig;
