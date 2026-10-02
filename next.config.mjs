import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Docker image only (Dockerfile sets NEXT_OUTPUT). Standalone output can't be
  // combined with a custom server, and cPanel needs one (app.cjs), so it stays
  // off by default.
  ...(process.env.NEXT_OUTPUT === "standalone" && { output: "standalone" }),
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
