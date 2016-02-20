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
router.get('/info/valid/:HospKey', function(req, res){
  hosps.setParam(req.params);
  hosps.getHospCheck(res, renderData);
});
/* 한의원 정보 등록 */
router.post('/info/signup', function(req,res){
  hosps.setParam(req.params, req.query, req.body);
  hosps.setHospInfo(res, renderData);
});
/* 한의원 등록된 거래처 조회 */
router.get('/pharm/:HospKey', function(req, res){
  hosps.setParam(req.params, req.query, req.body);
  hosps.getPharmListInHosp(res, renderData);
});
/* 한의원 거래처 등록 요청 -*/
router.post('/pharm/req/:HospKey/:PharmKey', function(req,res){
  hosps.setParam(req.params, req.query, req.body);
  hosps.setPharmInHosp(res, renderData);
});
/* 한의원 거래처 등록 취소 */
router.delete('/pharm/req/:HospKey/:PharmKey', function(req,res){
  hosps.setParam(req.params, req.query, req.body);
  hosps.delPharmInHosp(res, renderData);
});
/* 한의원 거래처 강제 삭제 */
router.delete('/pharm/ban/:HospKey/:PharmKey', function(req, res){
  hosps.setParam(req.params, req.query, req.body);
  hosps.banPharmInHosp(res, renderData);
});
/* 한의원 처방전 작성 */
router.post('/drug/:HospKey/:PharmKey', function(req, res){
  hosps.setParam(req.params, req.query, req.body);
  hosps.setPrescription(res, renderData);
});
/* 한의원 약업사 단가 조회*/
router.get('/pharm/drug', function(req,res){
  hosps.setParam(req.params, req.query, req.body);
  hosps.getPharmDrugList(res, renderData);
});


module.exports = router;
