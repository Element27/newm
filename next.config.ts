import type { NextConfig } from "next";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
let supabaseHost: string | undefined;
try {
  if (SUPABASE_URL) supabaseHost = new URL(SUPABASE_URL).hostname;
} catch {}

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      supabaseHost
        ? {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          }
        : undefined,
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ].filter(Boolean) as NonNullable<NextConfig["images"]>["remotePatterns"],
  },
};

export default nextConfig;
