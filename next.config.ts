import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow common hosts + Cursor preview origins in `next dev`
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "*.cursor.com",
    "cursor.com",
  ],
};

export default nextConfig;
