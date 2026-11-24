import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // IIT-GPU-Manager was renamed to Slurm Deck; keep the old indexed URL working
      { source: "/projects/iit-gpu-manager", destination: "/projects/slurm-deck", permanent: true },
    ];
  },
  experimental: {
    // reactCompiler: true,
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
