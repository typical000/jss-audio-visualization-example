'use strict'

var WebpackDevServer = require('webpack-dev-server')
var webpack = require('webpack')
var express = require('express')
var webpackConfig = require('../webpack.config.dev')

var host = process.env.HOST || 'localhost'
var port = process.env.PORT || 8080

// Add dev-server and hot reloading to webpack config.
webpackConfig.entry.app.unshift(
  'webpack-dev-server/client?http://' + host + ':' + port + '/',
  'webpack/hot/dev-server'
)

var compiler = webpack(webpackConfig)

var serverConfig = {
  stats: { colors: true },
  hot: true,
  inline: true,
  contentBase: webpackConfig.output.path
}

var server = new WebpackDevServer(compiler, serverConfig)

server.listen(port)
