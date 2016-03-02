var master = require('../neoherb/master');
var commons = require('../modules/commons');  // custom function collection
var express = require('express');
var url = require('url');
var multipart = require('connect-multiparty');
var multiparty = multipart();
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

router.get('/admin', function(req, res, next){
  var adata = {};
  if(!commons.isNone(req.query.idx)) adata.noticeidx = req.query.idx;

  if(commons.isEmpty(adata))console.log("empty");

  res.render('admin/manager', { data : adata });
});

/* 중계서버 공지사항 조회 */
router.get('/notice/list', function(req,res){
  //console.log(req.params, req.query);
  master.setParam(req.params, req.query);
  master.getNoticeList(res, renderData);
});

/* 중계서버 공지사항 저장 */
router.post('/admin/notice', multiparty, function(req,res){
  master.setSaveNoticeData(res, req, function(res, result){
    res.redirect('/master/admin?idx='+ result.jsData[0].인덱스);
  });
});

router.post('/upload', function(req, res){
  console.log("파일 업로드");
  //console.log(req.param, req.query, req.body);
  console.log(req.files);
  res.send("success");
});

router.get('/drugmaster', function(req, res){
  master.getDrugMasterList(res, renderData);
});

module.exports = router;
