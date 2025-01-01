/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    fallbackNode: true, 
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
