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
    formats: ["image/avif", "image/webp"],
  },

  compress: true,

  poweredByHeader: false,

  async rewrites() {
    const apiTarget = process.env.API_PROXY_TARGET ?? process.env.NEXT_PUBLIC_API_URL;

    if (!apiTarget) return [];

    return [
      {
        source: "/api/:path*",
        destination: `${apiTarget.replace(/\/$/, "")}/api/:path*`,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "0" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/favicon.svg",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
