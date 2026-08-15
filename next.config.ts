import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Minimal, self-contained build output for the Docker image — see
  // Dockerfile, which copies .next/standalone instead of node_modules.
  output: "standalone",
};

export default withNextIntl(nextConfig);
