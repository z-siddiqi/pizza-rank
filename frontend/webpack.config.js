const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './public/build'),
    filename: 'script.js',
  },
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  }
};