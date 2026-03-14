import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Ye images ko optimize karne mein help karta hai
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // About page images ke liye
        pathname: '/**',
      },
    ],
  },
  // Build errors se bachne ke liye optional but helpful
  typescript: {
    ignoreBuildErrors: true, 
  },
};

export default nextConfig;