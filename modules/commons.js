var neoJson = require('./json'); // resultSet
var neoCons = require('./constants'); // constants collection

exports.encrypt = function(target){
  var cypher = require('./gibberish-aes').GibberishAES;
  var key = 'gksqkd79gksqkd79gksqkd79gksqkd79';
  cypher.size(256);
  return cypher.aesEncrypt(target,key);
};

exports.getCurrentDate = function(format){
  var neoDate = new Date();
  var cYear = neoDate.getFullYear();
  var cMonth = neoDate.getMonth() + 1;
  var cDate = neoDate.getDate();

  cMonth = (cMonth < 10 ? "0" : "") + cMonth;
  cDate = (cDate < 10 ? "0" : "") + cDate;

  return cYear+"-"+cMonth+"-"+cDate;
};

exports.isNone = function(target){
  if(target === undefined || target === "" || target === null){
    return true;
  }else{
    return false;
  }
};

exports.isEmpty = function(obj){
  if(obj === null) return true;
  for(var key in obj){
    if(Object.hasOwnProperty.call(obj, key)) return false;
  }
  return true;
};


exports.combine = function(a, b, c){
  var back = (typeof c === 'function' ? true : false);
  if(!exports.isNone(b)){
    if(!back){
      for(var i in b){
        a[i] = b[i];
      }
    }else{
      var d = JSON.parse(JSON.stringify(a));
      for(var k in b){
        d[k] = b[k];
      }
      return c(d);
    }
  }
};

exports.set = function (arr) {
  return arr.reduce(function (a, val) {
    if (a.indexOf(val) === -1) {
        a.push(val);
    }
    return a;
  }, []);
};

exports.resultQuery = function(res, callback, err, rs, msg){
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
};

exports.resultSet = function(res, callback, err, recordsets, customObj){
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
        if(exports.isNone(customObj)){
          neoJson.set('jsData', recordsets[0]);
        }else{
          neoJson.set('jsData', customObj.setData(recordsets));
        }
      }
    }
  }catch(e){
    neoJson.set('status', 500);
    neoJson.set('message', e);
  }finally{
    return callback(res,neoJson.getAll());
  }
};


exports.ConvertToSingleObj = function(target){
  var oneline = {};
  for(var p in target){
    if(typeof target[p] === 'object'){
      for (var sp in target[p]){
        oneline[sp] = target[p][sp];
      }
    }else{
      oneline[p] = target[p];
    }
  }

  return oneline;
};

exports.ConvertToUpdateQuery = function(target){
  var strQuery = "";
  for(var p in target){
    strQuery += (strQuery !== "" ? ", " : "");
    strQuery += " " + p + " = '" + target[p] + "' ";
  }
  return " Set " + strQuery;
};

exports.ConvertToInsertQuery = function(UserKey, tablename, data){
  var strQuery = "";
  var strFeilds = "";
  var strValues = "";


  for(var i in data){
    strFeilds += (strFeilds !== "" ? ", " : "");
    strValues += (strValues !== "" ? ", " : "");
    strFeilds += i;
    strValues += "'" + data[i] + "'";
  }

  strQuery = " Insert Into NeoHerbPharm_" + UserKey + ".." + tablename + "( ";
  strQuery += strFeilds + ") ";
  strQuery += " Values ( " + strValues + ") ";

  return strQuery;
};

exports.ConvertToDeleteQuery = function(UserKey, tablename, data){
  var strQuery = "";
  strQuery = " Delete From NeoHerbPharm_" + UserKey + ".." + tablename;
  strQuery += " Where 1 = 1 ";

  for(var i in data){
    strQuery += " AND " + i + " = '" + data[i] + "' ";
  }

  return strQuery;
};
