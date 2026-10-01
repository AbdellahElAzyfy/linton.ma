/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Docker image only (Dockerfile sets NEXT_OUTPUT). Standalone output can't be
  // combined with a custom server, and cPanel needs one (app.js), so it stays
  // off by default.
  ...(process.env.NEXT_OUTPUT === "standalone" && { output: "standalone" }),
};

export default nextConfig;
