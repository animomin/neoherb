var neoherb = require('../modules');    // Database manager
var neoJson = require('../modules/json'); // resultSet
var commons = require('../modules/commons');  // custom function collection
var neoCons = require('../modules/constants'); // constants collection
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
  combine(params,query);
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
  neoJson.init();

  var strQuery = "";
  for(var p in body){
    strQuery += " Update NeoHerbPharm_" + params.UserKey + '.dbo.' + p + " ";
    strQuery += commons.ConvertToUpdateQuery(body[p]);
    strQuery += " Where 한의원키 = " + params.ClientKey;
  }
  neoherb.execute(strQuery, function(err, rs){
    resultQuery(res, callback, err, rs, neoCons.UPDATESUCCESS);
  });
};

exports.setClientInfo = function(res, callback){
  console.log("약업사 거래처 등록");
  neoJson.init();
  var strQuery = "";
  for(var i in body){
    strQuery += " " + commons.ConvertToInsertQuery(params.UserKey, i, body[i]);
  }
  neoherb.execute(strQuery, function(err, rs){
    resultQuery(res, callback, err, rs, neoCons.INSERTSUCCESS);
  });
};

exports.delClientInfo = function(res, callback){
  console.log("약업사 거래처 삭제");
  neoJson.init();
  var strQuery = "";
  strQuery = " Delete From NeoHerbPharm_" + params.UserKey + ".dbo.T_거래처";
  strQuery += " Where 한의원키 = " + params.ClientKey;
  neoherb.execute(strQuery, function(err, rs){
    resultQuery(res, callback, err, rs, neoCons.DELETESUCCESS);
  });

};

exports.getPrescriptionList = function(res, callback){
  console.log("약업사 처방전 리스트 조회");
  neoJson.init();
  combine(params,query);
  getDataCount(neoProc.PrescriptionListCount);
  neoherb.executeProcedure(params, neoProc.PrescriptionList, function(err, recordsets, returnValue){
    resultSet(res, callback, err, recordsets);
  });
};

exports.getPrescriptionDetailInfo = function(res, callback){
  console.log("약업사 처방전 상세 조회");
  neoJson.init();
  neoherb.executeProcedure(params, neoProc.PrescriptionDetailInfo,function(err, recordsets, returnValue){
    resultSet(res, callback, err, recordsets, neoJson.prescriptionInfo);
  });
};

exports.updatePrescriptionInfo = function(res, callback){
  console.log("약업사 처방전 수정");
  var strQuery = "";
  for(var p in body){
    strQuery += " Update NeoHerbPharm_" + params.UserKey + '.dbo.' + p + " ";
    strQuery += commons.ConvertToUpdateQuery(body[p]);
    strQuery += " Where 처방전키 = " + params.DrugKey;
  }
  neoJson.init();
  neoherb.execute(strQuery, function(err, rs){
    resultQuery(res, callback, err, rs, neoCons.UPDATESUCCESS);
  });
};

exports.getDrugInfoList = function(res, callback){
  console.log("약업사 본초 정보 조회");
  neoJson.init();
  getDataCount(neoProc.DrugInfoListCount);
  neoherb.executeProcedure(params, neoProc.DrugInfoList, function(err, recordsets, returnValue){
    resultSet(res, callback, err, recordsets);
  });
};

exports.getDrugInfoUpdateHistory = function(res, callback){
  console.log("약업사 본초 변경내역 조회");
  neoJson.init();
  getDataCount(neoProc.DrugInfoUpdateHistoryCount);
  neoherb.executeProcedure(params, neoProc.DrugInfoUpdateHistory, function(err, recordsets, returnValue){
    resultSet(res, callback, err, recordsets);
  });
};

exports.setDrugInfo = function(res, callback){
  console.log("약업사 본초 추가");
  neoJson.init();
  var strQuery = "";
  for(var i in body){
    strQuery += " " + commons.ConvertToInsertQuery(params.UserKey, i, body[i]);
  }
  neoherb.execute(strQuery, function(err,rs){
    resultQuery(res, callback, err, rs, neoCons.INSERTSUCCESS);
  });
};

exports.delDrugInfo = function(res, callback){
  console.log("약업사 본초 삭제");
  neoJson.init();
  var strQuery = "";
  for(var i in body){
    for(var k in body[i]){
      strQuery += " " + commons.ConvertToDeleteQuery(params.UserKey, i , body[i][k]);
    }
  }
  neoherb.execute(strQuery, function(err, rs){
    resultQuery(res, callback, err, rs, neoCons.DELETESUCCESS);
  });
};

exports.updateDrugInfo = function(res, callback){
  console.log("약업사 본초 수정");
  neoJson.init();

  var strQuery = "";
  strQuery = "";
  for(var i in body){
    strQuery += " Update NeoHerbPharm_" + params.UserKey + ".dbo." + i + " ";
    strQuery += commons.ConvertToUpdateQuery(body[i]);
    strQuery += " Where 본초마스터키 = " + params.DrugKey;
  }

  neoherb.execute(strQuery, function(err, rs){
    resultQuery(res, callback, err, rs, neoCons.UPDATESUCCESS);
  });
};

exports.getDeadlineList = function(res, callback){
  console.log("약업사 처방전 결산");
  neoJson.init();
  combine(params, query);
  getDataCount(neoProc.DeadlineListCount);
  neoherb.executeProcedure(params, neoProc.DeadlineList, function(err, recordsets, returnValue){
    resultSet(res, callback, err, recordsets, neoJson.deadline);
  });
};

exports.getStatList = function(res, callback){
  console.log("약업사 처방전 집계");
  neoJson.init();
  combine(params, query);
  //getDataCount(neoProc.StatListCount);  
  neoherb.executeProcedure(params, neoProc.StatList, function(err, recordsets, returnValue){
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
