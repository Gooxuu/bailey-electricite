import type { NextConfig } from "next";
import path from "path";

// Sur GitHub Pages en « project page », le site est servi sous /<nom-du-depot>.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basePath ? { basePath } : {}),
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
