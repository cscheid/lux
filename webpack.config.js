var webpack = require('webpack');

var outfile = 'lux.js';
var PROD = false;
if (process.env.PROD_ENV) {
    outfile = 'lux.min.js';
    PROD = true;
}

module.exports = {
  entry: ['babel-polyfill', __dirname + '/src/hook.js'],
  output: {
    path: __dirname + '/build',
    filename: outfile
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }]
  },
  resolve: {
    modulesDirectories: ['src', 'node_modules'],
    extensions: ['', '.js']
  },
  plugins: PROD ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ]: [],
  devtool: 'sourcemap'
};
