var hosps = require('../neoherb/hosps');
var express = require('express');
var url = require('url');
var router = express.Router();

function renderData(res, result){
  res.json(result);
}

router.use(function(req,res,next){
  hosps.initParam();
  next();
});


router.get('/', function(req, res, next) {

});

/* 한의원 중복 체크 */
router.get('/info/valid/:hospKey', function(req, res){
  hosps.setParam(req.params);
  hosps.getHospCheck(res, renderData);
});
/* 한의원 정보 등록 */
router.post('/info/signup', function(req,res){
  hosps.setParam(req.params, req.query, req.body);
  hosps.setHospInfo(res, renderData);
});



module.exports = router;
