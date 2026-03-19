/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'guaq.framer.ai' },
    ],
  },
  output: 'standalone',
};

export default nextConfig;
