'use strict'

var webpack = require('webpack')
var path = require('path')
var CopyFilesPlugin = require('copy-webpack-plugin')

var dependencies = require('./package.json').dependencies

module.exports = {
  entry: {
    app: [path.join(__dirname, 'src', 'index.js')],
    vendor: Object.keys(dependencies)
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist',
    filename: 'bundle.js'
  },
  module: {
    noParse: /\.min\.js/,
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, use: ['babel-loader']},
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, use: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, use: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: 'url?limit=10000&mimetype=image/svg+xml' },
      { test: /\.jpg$/, use: 'url-loader?limit=100000' },
      { test: /\.png$/, use: 'url-loader?limit=100000' },
      { test: /\.gif$/, use: 'url-loader?limit=100000' },
      { test: /\.jpg$/, use: 'file-loader' }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js'
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new CopyFilesPlugin([{
      from: './index.html',
      to: './index.html'
    }, {
      from: './src/media',
      to: './media'
    }])
  ]
}
