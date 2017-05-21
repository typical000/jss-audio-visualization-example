'use strict'

var webpack = require('webpack')
var config = require('./webpack.config.base')

config.plugins = config.plugins.concat([
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"'
    }
  }),

  // Ignore dev config
  new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

  // Optimizations
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress: {
      warnings: false
    }
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true
  })
])

module.exports = config
