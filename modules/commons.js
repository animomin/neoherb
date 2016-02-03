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
