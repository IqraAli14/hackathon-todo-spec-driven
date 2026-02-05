/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for development
  reactStrictMode: true,

  // Output standalone build for Docker deployment
  output: "standalone",

  // Disable x-powered-by header for security
  poweredByHeader: false,

  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  },

  // Configure allowed image domains if needed
  images: {
    domains: [],
  },

  // Experimental features
  experimental: {
    // Server Actions enabled by default in Next.js 14+
  },
};

module.exports = nextConfig;
