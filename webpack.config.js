// webpack.config.js
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  entry: path.join(__dirname, "src/bundle.js"),
  resolve: {
    extensions: [".js", ".jsx", ".json", ".wasm"],
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: `nexsys.min.js`,
  },
  module: {
    rules: [
      {
        // 1) match .js AND .jsx
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            // 2) ignore any .babelrc or babel.config.js
            babelrc: false,
            configFile: false,
            cacheDirectory: true,
            // 3) classic runtime replaces all JSX with React.createElement
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "classic" }],
            ],
          },
        },
      },
      // …your other rules (e.g. CSS loader)…
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: false,
          keep_fnames: true,
          toplevel: false,
          keep_classnames: true,
        },
      }),
    ],
  },
  externals: {
    nexevent: "eventStream",
    react: "React",
    "react-dom": "ReactDOM",
  },
};
