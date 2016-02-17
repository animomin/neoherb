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
};

exports.setHospInfo = function(res, callback){
  console.log("한의원 정보 등록");
  exports.getHospCheck(res, function(res, json){
    console.log(json.jsData[0].Status);
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
    "hospKey" : (!commons.isEmpty(params) ? params.hospKey : body.hospKey)
  };

  neoJson.init();
  neoherb.executeProcedure(hospKey, neoProc.getHospCheck, function(err, recordsets, returnValue){
    commons.resultSet(res, callback, err, recordsets);
  });
};
