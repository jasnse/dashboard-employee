import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',  // The root URL
        destination: '/login',  // Where it should redirect to
        permanent: true,  // Set to true for a 301 (permanent) redirect
      },
    ];
  },
};

export default nextConfig;

