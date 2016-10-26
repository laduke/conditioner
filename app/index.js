const express = require('express');
const app = express();

app.use(require('./site/router'));

module.exports = app;
