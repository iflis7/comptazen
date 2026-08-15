import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Minimal, self-contained build output for the Docker image — see
  // Dockerfile, which copies .next/standalone instead of node_modules.
  // Vercel does its own serverless function packaging and does not expect
  // (or support) a standalone build — leaving this on for Vercel builds
  // breaks them with "ENOENT .../.next/next-server.js.nft.json". Vercel
  // sets the VERCEL env var during its builds, so only opt into
  // standalone output when we're NOT building on Vercel (i.e. for Docker).
  output: process.env.VERCEL ? undefined : "standalone",
};

export default withNextIntl(nextConfig);
