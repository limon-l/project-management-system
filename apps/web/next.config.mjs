/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@boardflow/shared"],

  output: process.env.STANDALONE === "true" ? "standalone" : undefined,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
