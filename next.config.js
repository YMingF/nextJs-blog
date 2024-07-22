module.exports = {
  productionBrowserSourceMaps: true,
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: "file-loader",
        options: {
          outputPath: "static",
        },
      },
    ],
  },
};
