const slsw = require("serverless-webpack");

module.exports = {
  entry: slsw.lib.entries,
  target: "node",
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  externals: ["aws-sdk"],
  stats: slsw.lib.webpack.isLocal ? "errors-only" : "normal",
  optimization: {
    minimize: false,
  },
  performance: {
    hints: false,
  },
};
