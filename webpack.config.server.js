const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const StartServerPlugin = require('start-server-webpack-plugin')
const rootPath = path.resolve(__dirname)

module.exports = {
  entry: [
    'webpack/hot/poll?1000',
    './server/index',
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'server.js',
  },
  watch: true,
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
  },
  target: 'node',
  externals: [nodeExternals({ whitelist: ['webpack/hot/poll?1000'] })],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      // }, {
      //   test: /\.scss$/,
      //   // loader: 'null-loader'
      //   use: './loaders/sass-loader.js',
      // },
      }, {
        test: /\.scss$/,
        exclude: `${rootPath}/node_modules`,
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: false,
            importLoaders: 1,
            modules: true,
            localIdentName: '[name]-[hash:base64:5]',
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: false,
          },
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: false,
          },
        },
        ],
      },
    ],
  },
  plugins: [
    new StartServerPlugin('server.js'),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': { BUILD_TARGET: JSON.stringify('server') },
    }),
  ],
}
