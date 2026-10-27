/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    "bullmq",
    "ioredis",
    "@valkey/valkey-glide",
    "pg",
  ],
};

module.exports = nextConfig;
