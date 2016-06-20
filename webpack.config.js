var path = require("path");

module.exports = {
  context: __dirname,
  entry: "./lib/entry.js",
  output: {
    path: path.join(__dirname),
    filename: "bundle.js",
    devtoolModuleFilenameTemplate: '[resourcePath]',
    devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
  },
  devtool: 'source-maps',
  resolve: {
    extensions: ["", ".js"]
  }
};
