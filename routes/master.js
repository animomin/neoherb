var master = require('../neoherb/master');
var express = require('express');
var url = require('url');
var router = express.Router();

function renderData(res, result){
  res.json(result);
}

router.use(function(req,res,next){
  //console.log(url.parse(req.url).pathname);
  master.initParam();
  next();
});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/drugmaster', function(req, res){
  master.getDrugMasterList(res, renderData);
});

module.exports = router;
