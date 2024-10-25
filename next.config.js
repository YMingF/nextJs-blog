/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  productionBrowserSourceMaps: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },

  serverActions: {
    bodySizeLimit: "2mb", // Set desired value here
  },
  async rewrites() {
    return [
      {
        source: "/blogServer/api/v1/:path*",
        destination: "http://localhost:17903/api/v1/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
