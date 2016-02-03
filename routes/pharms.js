var pharms = require('../neoherb/pharms');
var express = require('express');
var url = require('url');
var router = express.Router();

function renderData(res, result){
  res.json(result);
}

router.use(function(req,res,next){
  console.log(url.parse(req.url).pathname);
  next();
});

router.get('/', function(req, res, next) {

});

router.get('/info/:UserKey', function(req,res){
  pharms.setParam(req.params);
  pharms.getPharmInfo(res,renderData);
});

router.get('/info/:UserId/:UserPw', function(req,res){
  pharms.setParam(req.params);
  pharms.getPharmInfo(res,renderData);
});

router.get('/list/:UserName?', function(req,res){
  pharms.setParam(req.params, req.query);
  pharms.getPharmList(res, renderData);
});

router.get('/client/:UserKey/:Status', function(req,res){
  pharms.setParam(req.params);
  pharms.getClientList(res, renderData);
});

router.get('/clientinfo/:UserKey/:ClientKey', function(req,res){
  pharms.setParam(req.params);
  pharms.getClientInfo(res, renderData);
});

router.put('/clientinfo/:UserKey/:ClientKey', function(req,res){
  pharms.setParam(req.params,req.query,req.body);
  pharms.updateClientInfo(res, renderData);
});

router.post('/clientinfo/:UserKey/:ClientKey', function(req,res){
  pharms.setParam(req.params,req.query,req.body);
  pharms.setClientInfo(res, renderData);
});

module.exports = router;
