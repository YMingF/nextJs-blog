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
};

module.exports = nextConfig;
