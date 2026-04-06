import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Next.js 16 WASM SWC type checker crashes on this environment.
    // Type checking is done via `tsc --noEmit` separately.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
