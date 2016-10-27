const express = require('express');
const app = express();

app.use(require('./site/router'));
app.use('/api/reports', require('./reports/router'));

module.exports = app;
