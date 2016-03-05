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
  if(!commons.isEmpty(p)){ params = JSON.parse(JSON.stringify(p)); console.log("Setted Params"); }
  if(!commons.isEmpty(q)){ query = JSON.parse(JSON.stringify(q)); console.log("Setted Query"); }
  if(!commons.isEmpty(b)){ body = JSON.parse(JSON.stringify(b)); console.log("Setted Body"); }

  console.log("Server Get Parameter Info " , __dirname);
  console.log("======================================");
  console.log(params,query, body);
  console.log("======================================");
};

exports.getPharmIDCheck = function(res, callback){
  console.log("약업사 ID 중복체크");
  var id = {
    "pharmID" : (!commons.isEmpty(params) ? params.pharmID : body.pharmID )
  };
  neoJson.init();
  neoherb.executeProcedure(id, neoProc.getPharmIDCheck, function(err, recordsets, returnValue){
    commons.resultSet(res, callback, err, recordsets);
  });
};

exports.setPharmInfo = function(res, callback){
  console.log("약업사 가입신청");
  exports.getPharmIDCheck(res, function(res, json){
    console.log(json.jsData[0].Status);
    if(json.jsData[0].Status === 500){
      callback(res, json);
    }else{
      neoJson.init();
      delete body.pharmPWD2;
      neoherb.executeProcedure(body, neoProc.PharmRegister, function(err, recordsets, returnValue){
        commons.resultSet(res, callback, err, recordsets);
      });
    }
  });
};

exports.setPharmDataBase = function(License){
  console.log('약업사 데이터베이스 생성');
  neoherb.executeProcedure({pKey : License}, neoProc.PharmCreateDatabase, function(err, recordsets, returnValue){
    if(err)console.log(err);
    //데이터베이스 안생기면 처리해야한다.
  });
};

exports.getPharmInfo = function(res, callback){
  console.log("약업사 정보 조회");
  neoJson.init();
  neoherb.executeProcedure(params, neoProc.PharmInfo, function(err, recordsets, returnValue){
    commons.resultSet(res, callback, err, recordsets);
  });
};

exports.updatePharmInfo = function(res, callback){
  console.log("약업사 정보 수정");
  neoJson.init();
  commons.combine(params,body);
  neoherb.executeProcedure(params, neoProc.PharmInfoUpdate, function(err, recordsets, returnValue){
    commons.resultSet(res, callback, err, recordsets);
  });
};

exports.getPharmList = function(res, callback){
  console.log("약업사 리스트 조회");
  neoJson.init();
  commons.combine(params,query);
  getDataCount(neoProc.PharmListCount);
  neoherb.executeProcedure(params, neoProc.PharmList, function(err, recordsets, returnValue){
    commons.resultSet(res, callback, err, recordsets);
  });
};

exports.getClientList = function(res, callback){
  console.log("약업사 거래처 조회");
  neoJson.init();
  commons.combine(params,query);
  getDataCount(neoProc.ClientListCount);
  neoherb.executeProcedure(params, neoProc.ClientList, function(err, recordsets, returnValue){
    commons.resultSet(res, callback, err, recordsets);
  });
};

exports.getClientInfo = function(res, callback){
  console.log("약업사 거래처 상세 정보");
  neoJson.init();
  neoherb.executeProcedure(params, neoProc.ClientInfo, function(err, recordsets, returnValue){
    commons.resultSet(res, callback, err, recordsets);
  });
};

exports.updateClientInfo = function(res, callback){
  console.log("약업사 거래처 정보 수정");
  neoJson.init();
  commons.combine(params, body, function(p){
    neoherb.executeProcedure(p, neoProc.ClientUpdate, function(err, recordsets, returnValue){
      commons.resultSet(res, callback, err, recordsets);
    });
  });

/*
  var strQuery = "";
  for(var p in body){
    strQuery += " Update NeoHerbPharm_" + params.UserKey + '.dbo.' + p + " ";
    strQuery += commons.ConvertToUpdateQuery(body[p]);
    strQuery += " Where 한의원키 = " + params.ClientKey;
  }
  neoherb.execute(strQuery, function(err, rs){
    commons.resultQuery(res, callback, err, rs, neoCons.UPDATESUCCESS);
  });
  */

};

exports.setClientInfo = function(res, callback){
  console.log("약업사 거래처 등록");
  neoJson.init();

  var CombineRecord = null;

  for(var i in body["T_거래처"]){

    commons.combine(params, body["T_거래처"][i], function(prm){

        neoherb.executeProcedure(prm, neoProc.ClientAdd, function(err, recordsets, returnValue){

            if(commons.isEmpty(CombineRecord))CombineRecord = JSON.parse(JSON.stringify(recordsets));
            else {
              for(var j in recordsets[0]){
                console.log(CombineRecord[0][0]);
                CombineRecord[0][CombineRecord[0].length] = JSON.parse(JSON.stringify(recordsets[0][j]));
                console.log(CombineRecord);
              }
            }

            if(CombineRecord[0].length == body["T_거래처"].length) commons.resultSet(res, callback, false, CombineRecord);
        });

    });
  }

};

exports.delClientInfo = function(res, callback){
  console.log("약업사 거래처 삭제");
  neoJson.init();
  neoherb.executeProcedure(params, neoProc.ClientDelete, function(err, recordsets, returnValue){
    commons.resultSet(res, callback, err, recordsets);
  });
  /*
  var strQuery = "";
  strQuery = " Delete From NeoHerbPharm_" + params.UserKey + ".dbo.T_거래처";
  strQuery += " Where 한의원키 = " + params.ClientKey;
  neoherb.execute(strQuery, function(err, rs){
    commons.resultQuery(res, callback, err, rs, neoCons.DELETESUCCESS);
  });
  */
};

exports.getPrescriptionList = function(res, callback){
  console.log("약업사 처방전 리스트 조회");
  neoJson.init();
  commons.combine(params,query);
  getDataCount(neoProc.PrescriptionListCount);
  neoherb.executeProcedure(params, neoProc.PrescriptionList, function(err, recordsets, returnValue){
    commons.resultSet(res, callback, err, recordsets);
  });
};

exports.getPrescriptionDetailInfo = function(res, callback){
  console.log("약업사 처방전 상세 조회");
  neoJson.init();
  neoherb.executeProcedure(params, neoProc.PrescriptionDetailInfo,function(err, recordsets, returnValue){
    console.log(recordsets);
    commons.resultSet(res, callback, err, recordsets, neoJson.prescriptionInfo);
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
    commons.resultQuery(res, callback, err, rs, neoCons.UPDATESUCCESS);
  });
};

exports.getDrugInfoList = function(res, callback){
  console.log("약업사 본초 정보 조회");
  commons.combine(params, query);
  neoJson.init();
  getDataCount(neoProc.DrugInfoListCount);
  neoherb.executeProcedure(params, neoProc.DrugInfoList, function(err, recordsets, returnValue){
    commons.resultSet(res, callback, err, recordsets);
  });
};

exports.getDrugInfoUpdateHistory = function(res, callback){
  console.log("약업사 본초 변경내역 조회");
  neoJson.init();
  getDataCount(neoProc.DrugInfoUpdateHistoryCount);
  neoherb.executeProcedure(params, neoProc.DrugInfoUpdateHistory, function(err, recordsets, returnValue){
    commons.resultSet(res, callback, err, recordsets);
  });
};

exports.setDrugInfo = function(res, callback){
  console.log("약업사 본초 추가");
  neoJson.init();
  console.log(params, query, body);
  neoJson.init();

  var CombineRecord = null;

  for(var i in body["T_약업사본초"]){

    commons.combine(params, body["T_약업사본초"][i], function(prm){

        neoherb.executeProcedure(prm, neoProc.DrugInfoAdd, function(err, recordsets, returnValue){
            if (err) {
              console.log(err);
            }
            if(commons.isEmpty(CombineRecord))CombineRecord = JSON.parse(JSON.stringify(recordsets));
            else {
              for(var j in recordsets[0]){
                console.log(CombineRecord[0][0]);
                CombineRecord[0][CombineRecord[0].length] = JSON.parse(JSON.stringify(recordsets[0][j]));
                console.log(CombineRecord);
              }
            }

            if(CombineRecord[0].length == body["T_약업사본초"].length) commons.resultSet(res, callback, false, CombineRecord);
        });

    });
  }
  /*
  var strQuery = "";
  for(var i in body){
    for(var si in body[i]){
      strQuery += " " + commons.ConvertToInsertQuery(params.UserKey, i, body[i][si]);
    }
  }
  console.log(strQuery);
  neoherb.execute(strQuery, function(err,rs){
    commons.resultQuery(res, callback, err, rs, neoCons.INSERTSUCCESS);
  });
  */
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
    commons.resultQuery(res, callback, err, rs, neoCons.DELETESUCCESS);
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
    commons.resultQuery(res, callback, err, rs, neoCons.UPDATESUCCESS);
  });
};

exports.getDeadlineList = function(res, callback){
  console.log("약업사 처방전 결산");
  neoJson.init();
  commons.combine(params, query);
  getDataCount(neoProc.DeadlineListCount);
  neoherb.executeProcedure(params, neoProc.DeadlineList, function(err, recordsets, returnValue){
    commons.resultSet(res, callback, err, recordsets, neoJson.deadline);
  });
};

exports.getStatList = function(res, callback){
  console.log("약업사 처방전 집계");
  neoJson.init();
  commons.combine(params, query);
  //getDataCount(neoProc.StatListCount);
  neoherb.executeProcedure(params, neoProc.StatList, function(err, recordsets, returnValue){
    commons.resultSet(res, callback, err, recordsets);
  });
};

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
