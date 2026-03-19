import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'guaq.framer.ai' },
    ],
  },
  output: 'standalone',
  webpack: (config) => {
    // Fix @google/genai resolution - package.json points to .mjs but only .cjs exists
    config.resolve.alias['@google/genai'] = path.resolve(
      __dirname,
      'node_modules/@google/genai/dist/node/index.cjs'
    );
    return config;
  },
};

export default nextConfig;
