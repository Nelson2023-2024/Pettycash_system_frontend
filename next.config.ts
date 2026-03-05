import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*", // any /api/... call in your Next.js app
        destination:`${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,  // forwarded to Django

      }
    ]
  },
};

export default nextConfig;
