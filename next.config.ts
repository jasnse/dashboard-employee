import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // For static export (required for Netlify)
  output: 'export',
  // Optional but recommended for Netlify
  trailingSlash: true,
};

export default nextConfig;
