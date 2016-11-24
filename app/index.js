const express = require('express');
const app = express();
const compression = require('compression');

app.use(compression());
app.use(require('./site/router'));
app.use('/api/reports', require('./reports/router'));
app.use('/api/distance', require('./travel-time/router'));


module.exports = app;
