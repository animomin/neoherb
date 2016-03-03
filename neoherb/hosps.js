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

exports.setHospInfo = function(res, callback){
  console.log("한의원 정보 등록");
  console.log(body);
  exports.getHospCheck(res, function(res, json){
    console.log(json);
    if(json.jsData[0].Status === 500){
      callback(res, json);
    }else{
      neoJson.init();
      neoherb.executeProcedure(body, neoProc.HospRegister, function(err, recordsets, returnValue){
        commons.resultSet(res, callback, err, recordsets);
      });
    }
  });
};

exports.getHospCheck = function(res, callback){
  console.log("한의원 중복 체크");
  var hospKey = {
    "HospKey" : (!commons.isEmpty(params) ? params.HospKey : body.HospKey)
  };
  neoJson.init();
  neoherb.executeProcedure(hospKey, neoProc.getHospCheck, function(err, recordsets, returnValue){
    commons.resultSet(res, callback, err, recordsets);
  });
};

exports.getHospInfo = function(res, callback){
  console.log("한의원 정보 조회");
  try{
    neoJson.init();
    neoherb.executeProcedure(params, neoProc.HospInformation, function(err, recordsets, returnValue){
      console.log(recordsets);
      commons.resultSet(res, callback, err, recordsets);
    });
  }catch(e){
    console.log(e);
  }
};

exports.getPharmListInHosp = function(res, callback){
  console.log("한의원 등록거래처 조회");
  neoJson.init();
  commons.combine(params, query);
  neoherb.executeProcedure(params, neoProc.HospPharmList, function(err, recordsets, returnValue){
    commons.resultSet(res, callback, err, recordsets);
  });
};

exports.setPharmInHosp = function(res, callback){
  console.log("한의원 거래처 등록 요청");
  neoJson.init();
  neoherb.executeProcedure(params, neoProc.HospPharmAdd, function(err, recordsets, returnValue){
    commons.resultSet(res, callback, err, recordsets);
  });
};

exports.delPharmInHosp = function(res, callback){
  console.log("한의원 거래처 등록 취소");
  neoJson.init();
  neoherb.executeProcedure(params, neoProc.HospPharmDelete, function(err, recordsets, returnValue){
    commons.resultSet(res, callback, err, recordsets);
  });
};

exports.banPharmInHosp = function(res, callback){
  console.log("한의원 거래처 강제 삭제");
  neoJson.init();
  neoherb.executeProcedure(params, neoProc.HospPharmBan, function(err, recordsets, returnValue){
    commons.resultSet(res, callback, err, recordsets);
  });
};

exports.setPrescription = function(res, callback){
  console.log("한의원 처방전 작성");
  var 처방전 = body["T_처방전"];
  var 본초 = body["T_처방전본초"];
  var 비용 = body["T_처방전비용"];


  neoJson.init();
  commons.combine(처방전,params);
  neoherb.executeProcedure(처방전, neoProc.HospAddPrescription, function(err, recordsets, returnValue){
    if (recordsets[0][0].Status === "200"){
      neoherb.executeProcedure(params, neoProc.HospGetPrescriptionKey, function(err, recordsets, returnValue){
        var DrugKey = recordsets[0][0].DrugKey;

        var strQuery = "";
        비용.처방전키 = DrugKey;
        strQuery += "\r\n " + commons.ConvertToInsertQuery(params.PharmKey, "T_처방전비용", 비용);
        for(var i in 본초){
          본초[i].처방전키 = DrugKey;
          strQuery += "\r\n " + commons.ConvertToInsertQuery(params.PharmKey, "T_처방전본초", 본초[i]);
        }
        neoherb.execute(strQuery, function(err,rs){
          commons.resultQuery(res, callback, err, rs, neoCons.INSERTSUCCESS);
        });
      });
    }else{
      commons.resultSet(res, callback, err, recordsets);
    }
  });
};

exports.getPharmDrugList = function(res, callback){
  console.log("한의원 약업사 단가 조회");
  neoJson.init();
  getDataCount(neoProc.HospPharmDruglistCount);
  neoherb.executeProcedure(params, neoProc.HospPharmDruglist, function(err, recordsets, returnValue){
    commons.resultSet(res, callback, err, recordsets);
  });
};

exports.getHospPromiseDrugList = function(res, callback){
  console.log("한의원 약속 처방 리스트 조회");
  neoJson.init();
  getDataCount(neoProc.HospPromiseDrugListCount);
  neoherb.executeProcedure(params, neoProc.HospPromiseDrugList, function(err, recordsets, returnValue){
    commons.resultSet(res, callback, err, recordsets);
  });
};

exports.setHospPromiseDrug = function(res, callback){
  console.log("한의원 약속처방 등록");
  neoJson.init();
  commons.combine(params, body, function(p){
    neoherb.executeProcedure(p, neoProc.HospPromiseDrugAdd, function(err, recordsets, returnValue){
      commons.resultSet(res, callback, err, recordsets);
    });
  });
};

exports.delHospPromiseDrug = function(res, callback){
  console.log("한의원 약속처방 삭제");
  neoJson.init();
  commons.combine(params, body, function(p){
    neoherb.executeProcedure(p, neoProc.HospPromiseDrugDelete, function(err, recordsets, returnValue){
      commons.resultSet(res, callback, err, recordsets);
    });
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
