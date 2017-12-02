const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const rootPath = path.resolve(__dirname)
const assetPath = `${rootPath}/public`

const extractSass = new ExtractTextPlugin({
  filename: '[name].css',
  disable: process.env.NODE_ENV === 'development',
})

module.exports = {
  devtool: false,
  entry: [
    './src/js/index',
  ],
  output: {
    path: assetPath,
    publicPath: '/public/js/',
    filename: 'app.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        // include: [
        //   // path.join(__dirname, 'client'),
        //   // path.join(__dirname, 'common'),
        //   // path.join(__dirname, 'server'),
        // ],
      }, {
        test: /\.scss$/,
        exclude: `${rootPath}/node_modules`,
        loader: extractSass.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1,
              modules: true,
              localIdentName: '[name]-[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
          ],
        }),
      },
    ],
  },
  plugins: [
    extractSass,
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': { BUILD_TARGET: JSON.stringify('client') },
    }),
  ],
}
