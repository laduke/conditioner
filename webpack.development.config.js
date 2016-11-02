var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  devtool: 'cheap-module-source-map',
  devServer: {
    proxy: {
      '/api/*': 'http://localhost:3000/'
    },
    stats: {
      chunks: false
    }
  },
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    'babel-polyfill',
    'whatwg-fetch',
    './app/main.js'
  ],
  output: {
    path: './wwwroot',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('styles.css')
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: path.join(__dirname, 'app'),
        exclude: /(node_modules)/,
        query: {
          plugins: ["react-hot-loader/babel"]
        }
      }, {
        test: /\.jsx?$/,
        loader: 'jsx?harmony',
        include: /materia-ui/
      }, {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'file?name=[name].[ext]'
      }, {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader'),
        include: path.join(__dirname, 'app')
      }, {
        test: /\.css$/,
        loader: 'style!css?modules',
        include: /flexboxgrid/
      }
    ]
  }
};
