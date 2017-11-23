const path = require('path')
var nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'index_bundle.js',
    library: '',
    libraryTarget: 'commonjs'
  },
  externals: [nodeExternals()],
  target: 'node',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ],
    rules: [
      { test: /\.js$/, use: ['babel-loader'] }
    ]
  }
}
