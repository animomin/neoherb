var pharms = require('../neoherb/pharms');
var express = require('express');
var url = require('url');
var router = express.Router();

function renderData(res, result){
  res.json(result);
}

router.use(function(req,res,next){
  //console.log(url.parse(req.url).pathname);
  pharms.initParam();
  next();
});

router.get('/', function(req, res, next) {

});
/** Web View Router Lists **/
router.get('/reg', function(req,res, next){
  res.render('pharms/signup', { title : '약업사 서비스 신청'});
});

/* 약업사 가입 신청 */
router.post('/reg/signup', function(req,res){
  pharms.setParam(req.params, req.query, req.body);
  pharms.setPharmInfo(res, renderData);
});
/* 약업사 아이디 중복 체크 */
router.get('/reg/:pharmID', function(req, res){
  pharms.setParam(req.params);
  pharms.getPharmIDCheck(res, renderData);
});
/* 약업사 정보 조회 By UserKey */
router.get('/info/:UserKey', function(req,res){
  pharms.setParam(req.params);
  pharms.getPharmInfo(res,renderData);
});
/* 약업사 정보 조회 By LoginID, PWD */
router.get('/info/:UserId/:UserPw', function(req,res){
  pharms.setParam(req.params);
  pharms.getPharmInfo(res,renderData);
});
/* 약업사 리스트 조회 */
router.get('/list/:UserName?', function(req,res){
  pharms.setParam(req.params, req.query);
  pharms.getPharmList(res, renderData);
});
/* 약업사 거래처 조회 */
router.get('/client/:UserKey/:Status', function(req,res){
  pharms.setParam(req.params);
  pharms.getClientList(res, renderData);
});
/* 약업사 거래처 상세조회 */
router.get('/clientinfo/:UserKey/:ClientKey', function(req,res){
  pharms.setParam(req.params);
  pharms.getClientInfo(res, renderData);
});
/* 약업사 거래처 정보 수정 */
router.put('/clientinfo/:UserKey/:ClientKey', function(req,res){
  pharms.setParam(req.params,req.query,req.body);
  pharms.updateClientInfo(res, renderData);
});
/* 약업사 거래처 등록 */
router.post('/clientinfo/:UserKey/:ClientKey', function(req,res){
  pharms.setParam(req.params,req.query,req.body);
  pharms.setClientInfo(res, renderData);
});
/* 약업사 거래처 삭제 */
router.delete('/clientinfo/:UserKey/:ClientKey', function(req, res){
  pharms.setParam(req.params);
  pharms.delClientInfo(res, renderData);
});
/* 약업사 처방전 리스트 조회 */
router.get('/drug/:UserKey', function(req,res){
  pharms.setParam(req.params, req.query);
  pharms.getPrescriptionList(res, renderData);
});
/* 약업사 처방전 상세 조회 */
router.get('/drug/:UserKey/:DrugKey', function(req,res){
  pharms.setParam(req.params);
  pharms.getPrescriptionDetailInfo(res, renderData);
});
/* 약업사 처방전 정보 수정 */
router.put('/drug/:UserKey/:DrugKey', function(req, res){
  pharms.setParam(req.params,req.query, req.body);
  pharms.updatePrescriptionInfo(res, renderData);
});
/* 약업사 본초 정보 조회 */
router.get('/druginfo/:UserKey', function(req, res){
  pharms.setParam(req.params);
  pharms.getDrugInfoList(res, renderData);
});
/* 약업사 본초 상세 정보 조회 */
router.get('/druginfo/:UserKey/:DrugKey', function(req, res){
  pharms.setParam(req.params);
  pharms.getDrugInfoUpdateHistory(res, renderData);
});
/* 약업사 본초 추가 */
router.post('/druginfo/:UserKey', function(req, res){
  pharms.setParam(req.params,req.query, req.body);
  pharms.setDrugInfo(res, renderData);
});
/* 약업사 본초 삭제 */
router.delete('/druginfo/:UserKey', function(req, res){
  pharms.setParam(req.params, req.query, req.body);
  pharms.delDrugInfo(res, renderData);
});
/* 약업사 본초 수정 */
router.put('/druginfo/:UserKey/:DrugKey', function(req, res){
  pharms.setParam(req.params, req.query, req.body);
  pharms.updateDrugInfo(res, renderData);
});
/* 약업사 처방전 결산 */
router.get('/deadline/:UserKey/:ClientKey?', function(req,res){
  pharms.setParam(req.params, req.query);
  pharms.getDeadlineList(res, renderData);
});
/* 약업사 처방전 집계 */
router.get('/stat/:UserKey/:ClientKey?', function(req,res){
  pharms.setParam(req.params, req.query);
  pharms.getStatList(res, renderData);
});

module.exports = router;
