var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    './app/main.js'
  ],
  output: {
    path: path.join(__dirname, 'wwwroot'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'app'),
      exclude: /(node_modules)/
    }, {
      test: /\.html$/,
      exclude: /node_modules/,
      loader: 'file?name=[name].[ext]'
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader'),
      include: path.join(__dirname, 'app')
    }
]
  }
};
