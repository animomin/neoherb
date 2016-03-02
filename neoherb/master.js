var neoherb = require('../modules');    // Database manager
var neoJson = require('../modules/json'); // resultSet
var commons = require('../modules/commons');  // custom function collection
var neoCons = require('../modules/constants'); // constants collection
var fs = require('fs');
var path = require('path');
var neoProc = neoCons.neoProc;
var params, query, body;

exports.initParam = function(){
  params = null;
  query = null;
  body = null;
};
exports.setParam = function(p,q,b){
  if(!commons.isEmpty(p)) params = JSON.parse(JSON.stringify(p));
  if(!commons.isEmpty(q)) query = JSON.parse(JSON.stringify(q));
  if(!commons.isEmpty(b)) body = JSON.parse(JSON.stringify(b));
  console.log("Server Get Parameter Info " , __dirname);
  console.log("======================================");
  console.log(params,query, body);
  console.log("======================================");
};

exports.getDrugMasterList = function(res, callback){
  console.log("중계서버 본초 마스터 리스트 조회");
  neoJson.init();
  getDataCount(neoProc.DrugMasterListCount);
  neoherb.executeProcedure(null, neoProc.DrugMasterList, function(err, recordsets, returnValue){
    resultSet(res, callback, err, recordsets);
  });
};

exports.getNoticeList = function(res, callback){
  console.log("중계서버 공지사항 조회");
  neoJson.init();
  neoherb.executeProcedure(query, neoProc.MasterNoticeList, function(err, recordsets, returnValue){
    resultSet(res, callback, err, recordsets);
  });
};

exports.setSaveNoticeData = function(res, req, callback){
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

  var notice = {};
  if(!commons.isNone(req.params.PharmKey)) notice.PharmKey = req.params.PharmKey;
  else notice.PharmKey = 0;
  console.log(req.body);
  notice.제목 = req.body["notice-title"];
  notice.내용 = req.body["notice-content"];
  notice.시작일자 = req.body["notice-startdate"];
  notice.종료일자 = req.body["notice-enddate"];

  neoJson.init();
  neoherb.executeProcedure(notice, neoProc.MasterNoticeAdd, function(err, recordsets, returnValue){
    resultSet(res, callback, err, recordsets);
  });
};

function combine(a, b){
  if(!commons.isNone(b)){
    for(var i in b){
      a[i] = b[i];
    }
  }
}

function getDataCount(proc){
  var cParams = null;
  if(!commons.isEmpty(params)){
    cParams = JSON.parse(JSON.stringify(params));
    delete cParams.page;
    delete cParams.ppc;
  }else{
    cParams = null;
  }
  neoherb.executeProcedure(cParams, proc, function(err,recordsets,returnValue){
    try{
      neoJson.set('dataTotalCount', recordsets[0][0]['전체수']);
    }catch(e){
      console.log(e);
    }
  });
}

function resultQuery(res, callback, err, rs, msg){
  try{
    if(err){
      neoJson.set('status',500);
      neoJson.set('message', err);
    }else{
      neoJson.set('status', 200);
      neoJson.set('message', msg);
    }
  }catch(e){
    neoJson.set('status',500);
    neoJson.set('message', e);
  }
  return callback(res,neoJson.getAll());
}

function resultSet(res, callback, err, recordsets, customObj){
  try{
    if(err){
      neoJson.set('status',500);
      neoJson.set('message', err);
    }else{
      neoJson.set('datacount', recordsets[0].length);
      if(neoJson.get('dataTotalCount')*1 === 0) neoJson.set('dataTotalCount', recordsets[0].length);
      if(neoJson.get('datacount') <= 0 ){
        neoJson.set('status', 500);
        neoJson.set('message', neoCons.NODATA);
      }else{
        neoJson.set('status',200);
        neoJson.set('message', neoCons.SUCCESS);
        if(commons.isNone(customObj)){
          neoJson.set('jsData', recordsets[0]);
        }else{
          neoJson.set('jsData', customObj.setData(recordsets));
        }
      }
    }
  }catch(e){
    console.log(e);
    neoJson.set('status', 500);
    neoJson.set('message', e);
  }finally{
    return callback(res,neoJson.getAll());
  }
}
