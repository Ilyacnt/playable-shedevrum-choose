const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: ['./src/script.js', './src/style.css'],
  output: {
    publicPath: '',
    assetModuleFilename: '[name][ext]',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/inline',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body',
    }),
    new HtmlInlineScriptPlugin()
  ],
  devServer: {
    static: path.resolve(__dirname, 'src', ""),
    hot: true,
    liveReload: true,
    watchFiles: ['src/**/*'],
  },
  watch: true,
};
