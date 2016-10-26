var express = require('express');
var join = require('path').join;

var router = new express.Router();


router.use(express.static(join(__dirname, '../../wwwroot')));

module.exports = router;
