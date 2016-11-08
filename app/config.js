const dotenv = require('dotenv');
dotenv.load();

var config = module.exports;
var PRODUCTION = process.env.NODE_ENV === 'production';

config.express = {
  port: process.env.PORT || 3000,
  ip: '127.0.0.1'
};

config.googleMapsAPIKey = {
  key: process.env.GOOGLE_MAPS_API_KEY || ''
};

config.mongodb = {
  port: process.env.MONGODB_PORT || 27017,
  host: process.env.MONGODB_HOST || 'localhost'
};

if (PRODUCTION) {
  // for example
  config.express.ip = '0.0.0.0';
}
