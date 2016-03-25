var master = require('../neoherb/master');
var commons = require('../modules/commons');  // custom function collection
var express = require('express');
var url = require('url');
var multipart = require('connect-multiparty');
var multiparty = multipart();
var router = express.Router();
var sendData = {
  type : 0,
  title : "",
  sidemenu : {
    main : 0,
    sub : 0
  },
  body : "",
  hosp : null,
  pharm : null,
  query : null,
  Clear : function(){
    this.type = 2; //0 maser 1 pharm 2 hosp
    this.title = "";
    //this.sidemenu = null;
    this.sidemenu.main = 0;
    this.sidemenu.sub = 0;
    this.body = "";
    this.pharm = {};
    this.hosp = {};
    this.query = {};
  }
};

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

router.get('/admin', function(req, res){
  sendData.Clear();
  sendData.title = '원외탕전실 관리자페이지';
  //sendData.sidemenu.main = cons.neoMenuID.MAINPAGE;
  //sendData.sidemenu.sub = 0;
  //sendData.hosp = hosp.jsData[0];
  sendData.body = '';
  res.render('admin/index', sendData);
});

/*
router.get('/admin', function(req, res, next){
  var adata = {};
  if(!commons.isNone(req.query.idx)) adata.noticeidx = req.query.idx;

  if(commons.isEmpty(adata))console.log("empty");

  res.render('admin/manager', { data : adata });
});
*/
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
