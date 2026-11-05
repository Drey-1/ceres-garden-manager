import type { NextConfig } from "next";

const API_URL = process.env.API_URL

if (!API_URL) {
  throw new Error("API_URL is not defined.");
}

if(API_URL.endsWith("/")) {
  throw new Error("API_URL ends with '/', which will cause the requests to fail.")
}

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/:path*`
      }
    ]
  }
};

export default nextConfig;
