/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;

const withOffline = require('next-offline');

module.exports = withOffline(nextConfig);
