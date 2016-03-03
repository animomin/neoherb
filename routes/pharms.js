var pharms = require('../neoherb/pharms');
var master = require('../neoherb/master');
var commons = require('../modules/commons');  // custom function collection
var cons = require('../modules/constants');  // custom function collection
var express = require('express');
var url = require('url');
var router = express.Router();

var sendData = {
  type : 0,
  title : "",
  sidemenu : {
    main : 0,
    sub : 0
  },
  body : "",
  pharm : null,
  Clear : function(){
    this.type = 1; //0 maser 1 pharm 2 hosp
    this.title = "";
    //this.sidemenu = null;
    this.sidemenu.main = 0;
    this.sidemenu.sub = 0;
    this.body = "";
    this.pharm = null;
  }
};

function renderData(res, result){
  res.json(result);
}

function CheckLogin(req,res){
  console.log("세션 약업사키 ", req.session.PharmKey);
  console.log("파라미터 약업사키 ", req.params.PharmKey);
  if(req.session.PharmKey*1 === req.params.PharmKey*1){
    return true;
  }
  res.redirect('/pharm/index/'+ req.params.PharmKey);
  return false;
}

router.use(function(req,res,next){
  pharms.initParam();
  next();
});

router.get('/', function(req, res, next) {

});
/** Web View Router Lists **/

/* 약업사 가입 신청 페이지 */
router.get('/reg', function(req,res, next){
  try{
    sendData.Clear();
    sendData.title = "약업사 서비스신청";
    sendData.sidemenu.main = cons.neoMenuID.PHARM.SIGNUP;
    sendData.sidemenu.sub = cons.neoMenuID.PHARM.SIGNUP;
    sendData.body = 'gray-bg';
    sendData.pharm = {};
    res.render('pharm/signup', sendData);
  }catch(e){
    throw e;
  }
});
/* 약업사 가입 신청 */
router.post('/reg', function(req, res){
  delete req.body.pharmPWD2;
  pharms.setParam(req.params, req.query, req.body);
  pharms.setPharmInfo(res, function(res, result){
    if(!commons.isNone(result.jsData[0].License)){
      pharms.setPharmDataBase(result.jsData[0].License);
    }
    res.send(result);
  });
});

/* 약업사 메인화면 */
router.get('/index/:PharmKey', function(req, res){
  var pharmInfo = null;
  if(!commons.isNone(req.session.PharmKey)){
    delete req.session.PharmKey;
    delete req.session.pharm;
  }
  pharms.setParam({UserKey: req.params.PharmKey});
  pharms.getPharmInfo(res, function(res, pharm){
    pharmInfo = pharm.jsData[0];
    //req.session.pharm = JSON.stringify(pharmInfo);
    req.session.pharm = pharmInfo;
    req.session.PharmKey = req.params.PharmKey;
    //req.session.cookie.expires = new Date(Date.now() + 3600000);
    sendData.Clear();
    sendData.title = '약업사 메인';
    sendData.sidemenu.main = cons.neoMenuID.MAINPAGE;
    sendData.sidemenu.sub = 0;
    sendData.pharm = pharmInfo;
    sendData.body = 'fixed-sidebar no-skin-config full-height-layout';

    res.render('pharm/index', sendData);
  });
});

/* 약업사 공지사항 관리 메인 */
router.get('/notice/:PharmKey', function(req, res){
  if(CheckLogin(req,res)){
    sendData.Clear();
    sendData.title = '약업사 공지사항 관리';
    sendData.sidemenu.main = cons.neoMenuID.PHARM.NOTICEMANAGE;
    sendData.sidemenu.sub = cons.neoMenuID.PHARM.NOTICEMANAGE_LIST;
    sendData.body = '';
    sendData.pharm = req.session.pharm;
    res.render('pharm/index', sendData);
  }
});

/* 약업사 공지사항 뷰 */
router.get('/notice/view/:PharmKey', function(req, res){
  if(CheckLogin(req,res)){
    sendData.Clear();
    sendData.title = '약업사 공지사항 관리';
    sendData.sidemenu.main = cons.neoMenuID.PHARM.NOTICEMANAGE;
    sendData.sidemenu.sub = cons.neoMenuID.PHARM.NOTICEMANAGE_VIEW;
    sendData.body = '';
    sendData.pharm = req.session.pharm;
    res.render('pharm/index', sendData);
  }
});

/* 약업사 공지사항 작성 */
router.get('/notice/write/:PharmKey', function(req, res){
  if(CheckLogin(req,res)){
    sendData.Clear();
    sendData.title = '약업사 공지사항 관리';
    sendData.sidemenu.main = cons.neoMenuID.PHARM.NOTICEMANAGE;
    sendData.sidemenu.sub = cons.neoMenuID.PHARM.NOTICEMANAGE_WRITE;
    sendData.body = '';
    sendData.pharm = req.session.pharm;
    res.render('pharm/index', sendData);
  }
});

/* 약업사 공지사항 저장 */
router.post('/notice/write/:PharmKey', function(req,res){
  if(CheckLogin(req, res)){
    console.log("저장들어갑니다");
    master.initParam();
    master.setParam(req.params, req.query, req.body);
    if(!commons.isEmpty(req.files)){
      /*
      console.log(req.files);
      fs.readFile(req.files.files.path, function(err, data){
        var filePath = path.join(global.appPath, '/public/uploads');
        filePath = path.join(filePath, '/' + req.files.files.name);
        fs.rename(req.files.files.path, filePath, function(err){
          if(err) throw err;
          fs.unlink(req.files.files.path,)
        });
      });
      */
    }
    master.setSaveNoticeData(res, renderData);
  }
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
router.get('/client/:UserKey/:Status?', function(req,res){
  pharms.setParam(req.params);
  pharms.getClientList(res, renderData);
});
/* 약업사 거래처 상세조회 */
router.get('/clientinfo/:UserKey/:ClientKey', function(req,res){
  pharms.setParam(req.params);
  pharms.getClientInfo(res, renderData);
});
/* 약업사 거래처 정보 수정 */
router.put('/clientinfo/:PharmKey/:HospKey', function(req,res){
  pharms.setParam(req.params,req.query,req.body);
  pharms.updateClientInfo(res, renderData);
});
/* 약업사 거래처 등록 */
router.put('/clientinfo/:UserKey', function(req,res){
  pharms.setParam(req.params,req.query,req.body);
  pharms.setClientInfo(res, renderData);
});
/* 약업사 거래처 삭제 */
router.delete('/clientinfo/:PharmKey/:HospKey', function(req, res){
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
  pharms.setParam(req.params,req.query, req.body);
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
