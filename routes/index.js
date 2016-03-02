var express = require('express');
var neoCons = require('../modules/constants'); // constants collection
var querystring= require('querystring');
var https = require('http');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.render('login',{title: '원외탕전실'});
});
module.exports = router;
