import type { NextConfig } from "next";

const nextConfig: NextConfig = { 
    turbopack: {
        root: __dirname, // explicitly set your workspace root
    },
};

export default nextConfig;