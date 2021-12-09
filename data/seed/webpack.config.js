//webpack.config.js
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const config = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    main: "./script.ts",
  },
  output: {
    path: resolve(dirname(fileURLToPath(import.meta.url)), './build'),
    filename: "script-bundle.js",
    module: true,
  },
  resolve: {
    extensions: [".ts"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader"
      }
    ]
  },
  target: 'node16',
  experiments: {
    outputModule: true,
  }
};

export default config;
