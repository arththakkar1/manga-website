/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next',
  experimental: {
    fallbackNode: true, 
  },
  images: {
    domains: ['api.mangadex.org',"https://uploads.mangadex.org"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
