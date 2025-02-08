const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    main: './src/js/main.js',
  },
  output: {
    filename: '[name].bundle.js',  // This should generate main.bundle.js
    path: path.resolve(__dirname, 'dist/js'),
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '../style/[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/js/service-worker.js', to: path.resolve(__dirname, 'dist/js/service-worker.js') },
        { from: 'src/js/movies.js', to: path.resolve(__dirname, 'dist/js/movies.js') },
        { from: 'src/js/quiz.js', to: path.resolve(__dirname, 'dist/js/quiz.js') },
        { from: 'src/js/hobby.js', to: path.resolve(__dirname, 'dist/js/hobby.js') },
        { from: 'src/js/chat.js', to: path.resolve(__dirname, 'dist/js/chat.js') },
        { from: 'src/js/chatTree.js', to: path.resolve(__dirname, 'dist/js/chatTree.js') }
      ]
    })
  ],
  mode: 'production',
};
