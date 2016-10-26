var path = require('path');
var webpack = require('webpack');

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
    './app/main.js'
  ],
  output: {
    path: './wwwroot',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin()
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
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'file?name=[name].[ext]'
      }
    ]
  }
};
