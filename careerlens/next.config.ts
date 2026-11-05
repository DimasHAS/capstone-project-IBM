/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for pdf-parse and mammoth (Node.js modules)
  serverExternalPackages: ["pdf-parse", "mammoth"],
};

export default nextConfig;
