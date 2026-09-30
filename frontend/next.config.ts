import type { NextConfig } from "next";

const backend = process.env.BACKEND_URL ?? "http://127.0.0.1:8085";

const config: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${backend}/api/:path*` },
      {
        source: "/v3/api-docs/:path*",
        destination: `${backend}/v3/api-docs/:path*`,
      },
    ];
  },
};

export default config;
