var hosps = require('../neoherb/hosps');
var master = require('../neoherb/master');
var commons = require('../modules/commons');  // custom function collection
var cons = require('../modules/constants');  // custom function collection
var express = require('express');
var url = require('url');

// 일단 여기서 사용
var request = require('request');
var glob = require('glob');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('../config.json', 'UTF-8'));
var bing = require('node-bing-api')({ accKey: config.bingkey });

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

function CheckLogin(req,res){
  console.log("세션 한의원키 ", req.session.HospKey);
  console.log("파라미터 약업사키 ", req.params.HospKey);
  if(req.session.HospKey*1 === req.params.HospKey*1){
    return true;
  }
  res.redirect('/hosp/index/'+ req.params.HospKey);
  return false;
}


router.use(function(req,res,next){
  hosps.initParam();
  next();
});


router.get('/', function(req, res, next) {

});

/* 한의원 메인 페이지 */
router.get('/index/:HospKey', function(req, res){
  if(!commons.isNone(req.session.HospKey)){
    delete req.session.HospKey;
    delete req.session.Hosp;
  }

  hosps.setParam(req.params);
  hosps.getHospInfo(res, function(res, hosp){
    req.session.HospKey = req.params.HospKey;
    req.session.Hosp = hosp.jsData[0];

    sendData.Clear();
    sendData.title = '한의원 메인';
    sendData.sidemenu.main = cons.neoMenuID.MAINPAGE;
    sendData.sidemenu.sub = 0;
    sendData.hosp = hosp.jsData[0];
    sendData.body = 'fixed-sidebar no-skin-config full-height-layout';

    res.render('hosp/index', sendData);
  });
});

/* 한의원 약업사 공지사항 */
router.get('/notice/:HospKey', function(req, res){
  if(CheckLogin(req, res)){
      sendData.Clear();
      sendData.title = '약업사 공지사항';
      sendData.sidemenu.main = cons.neoMenuID.PHARM.NOTICEMANAGE;
      sendData.sidemenu.sub = cons.neoMenuID.PHARM.NOTICEMANAGE_LIST;
      sendData.hosp = req.session.Hosp;
      sendData.body = '';
      if(!commons.isEmpty(req.query)) sendData.query = req.query;
      res.render('hosp/index', sendData);
  }
});

/* 한의원 마켓 페이지 */
router.get('/market/:HospKey', function(req, res){
  if(CheckLogin(req, res)){
    sendData.Clear();
    sendData.title = '한의원 약재장터';
    sendData.sidemenu.main = cons.neoMenuID.HOSP.MARKET;
    sendData.sidemenu.sub = cons.neoMenuID.HOSP.MARKET_LIST;
    sendData.hosp = req.session.Hosp;
    sendData.body = 'fixed-sidebar no-skin-config full-height-layout';
    res.render('hosp/index', sendData);
  }
});

/* 한의원 장바구니 페이지 */
router.get('/cart/:HospKey', function(req, res){
  if(CheckLogin(req, res)){
    sendData.Clear();
    sendData.title = '한의원 장바구니';
    sendData.sidemenu.main = cons.neoMenuID.HOSP.MARKET;
    sendData.sidemenu.sub = cons.neoMenuID.HOSP.MARKET_CART;
    sendData.hosp = req.session.Hosp;
    sendData.body = '';
    res.render('hosp/index', sendData);
  }
});

router.get('/market/product/:HospKey', function(req,res){
  // 한의원키 받고, 페이지 받아서 페이징 처리
  hosps.setParam(req.params, req.query);
  hosps.getMarketProductList(res, renderData);
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
router.post('/drug/prescript/:HospKey/:PharmKey', function(req, res){
  hosps.setParam(req.params, req.query, req.body);
  hosps.setPrescription(res, renderData);
});
/* 한의원 처방전 삭제 */
router.delete('/drug/prescript/:DrugKey/:PharmKey', function(req, res){
  hosps.setParam(req.params, req.query, req.body);
  hosps.delPrescription(res, renderData);
});

/* 한의원 약업사 단가 조회*/
router.get('/pharm/drug/:HospKey/:PharmKey', function(req,res){
  hosps.setParam(req.params, req.query, req.body);
  hosps.getPharmDrugList(res, renderData);
});
/* 한의원 약속처방 조회 */
router.get('/drug/promise/:HospKey', function(req,res){
  hosps.setParam(req.params, req.query, req.body);
  hosps.getHospPromiseDrugList(res, renderData);
});
/* 한의원 약속처방 등록 */
router.post('/drug/promise/:HospKey', function(req, res){
  hosps.setParam(req.params, req.query, req.body);
  hosps.setHospPromiseDrug(res, renderData);
});
/* 한의원 약속처방 삭제 */
router.delete('/drug/promise/:HospKey', function(req, res){
  hosps.setParam(req.params, req.query, req.body);
  hosps.delHospPromiseDrug(res, renderData);
});
/* 한의원 약재장터 주문내역 조회*/
router.get('/market/history/:HospKey', function(req, res){
  hosps.setParam(req.params, req.query, req.body);
  hosps.getMarketOrderHistory(res, renderData);
});

router.post('/market/order/:HospKey', function(req, res){
  hosps.setParam(req.params, req.query, req.body);
  hosps.setMarketOrder(res, renderData);
});

module.exports = router;
