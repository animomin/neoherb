var neoherb = require('../modules');    // Database manager
var neoJson = require('../modules/json'); // resultSet
var commons = require('../modules/commons');  // custom function collection
var neoCons = require('../modules/constants'); // constants collection
var neoProc = neoCons.neoProc;
var params, query, body;
exports.setParam = function(p,q,b){
  if(!commons.isNone(p)) params = JSON.parse(JSON.stringify(p));
  if(!commons.isNone(q)) query = JSON.parse(JSON.stringify(q));
  if(!commons.isNone(b)) body = JSON.parse(JSON.stringify(b));
};

exports.getPharmInfo = function(res,callback){
  console.log("약업사 정보 조회");
  neoJson.init();
  neoherb.executeProcedure(params, neoProc.PharmInfo, function(err, recordsets, returnValue){
    resultSet(res, callback, err, recordsets);
  });
};

exports.getPharmList = function(res, callback){
  console.log("약업사 리스트 조회");
  neoJson.init();
  combine(params,query);
  getDataCount(neoProc.PharmListCount);
  neoherb.executeProcedure(params, neoProc.PharmList, function(err, recordsets, returnValue){
    resultSet(res, callback, err, recordsets);
  });
};

exports.getClientList = function(res, callback){
  console.log("약업사 거래처 조회");
  neoJson.init();
  getDataCount(neoProc.ClienListCount);
  neoherb.executeProcedure(params, neoProc.ClienList, function(err, recordsets, returnValue){
    resultSet(res, callback, err, recordsets);
  });
};

exports.getClientInfo = function(res, callback){
  console.log("약업사 거래처 상세 정보");
  neoJson.init();
  neoherb.executeProcedure(params, neoProc.ClientInfo, function(err, recordsets, returnValue){
    resultSet(res, callback, err, recordsets);
  });
};

exports.updateClientInfo = function(res, callback){
  console.log("약업사 거래처 정보 수정");
  var strQuery = "";
  for(var p in body){
    strQuery += " Update NeoHerbPharm_" + params.UserKey + '.dbo.' + p + " ";
    strQuery += commons.ConvertToUpdateQuery(body[p]);
    strQuery += " Where 한의원키 = " + params.ClientKey;
  }
  neoJson.init();
  neoherb.execute(strQuery, function(err, rs){
    if(err){
      neoJson.set('status',500);
      neoJson.set('message', err);
    }else{
      neoJson.set('status', 200);
      neoJson.set('message', neoCons.UPDATESUCCESS);
    }
    return callback(res,neoJson.getAll());
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
  var cParams = JSON.parse(JSON.stringify(params));
  delete cParams.page;
  delete cParams.ppc;
  neoherb.executeProcedure(cParams, proc, function(err,recordsets,returnValue){
    try{
      neoJson.set('dataTotalCount', recordsets[0][0]['전체수']);
    }catch(e){
      console.log(e);
    }
  });
}

function resultSet(res, callback, err, recordsets, customObj){
  try{
    if(err){
      neoJson.set('status',500);
      neoJson.set('message', err);
    }else{
      neoJson.set('datacount', recordsets[0].length);
      if(neoJson.get('datacount') <= 0 ){
        neoJson.set('status', 500);
        neoJson.set('message', neoCons.NODATA);
      }else{
        neoJson.set('status',200);
        neoJson.set('message', neoCons.SUCCESS);
        if(commons.isNone(customObj)){
          neoJson.set('jsData', recordsets[0]);
        }else{

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
