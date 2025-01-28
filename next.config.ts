import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    appIsrStatus: false,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp3)$/,
      type: "asset/resource",
      generator: {
        filename: "static/media/[name][ext]",
      },
    });
    return config;
  },
  images: {
    domains: ["res.cloudinary.com"],
    // Optionally, you can also use remotePatterns for more specific control
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dmahm1k8v/**", // Replace with your cloud name
      },
    ],
  },

  /* config options here */
};

export default nextConfig;
