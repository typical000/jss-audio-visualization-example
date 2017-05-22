'use strict'

var webpack = require('webpack')

var config = require('./webpack.config.base')

config.plugins = config.plugins.concat([
  new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"'
    }
  }),
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
