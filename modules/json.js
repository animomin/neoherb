var resultSet = {
    status : "",
    message : "",
    datacount : 0,
    dataTotalCount : 0,
    currentpage : 0,
    jsData : null
};

exports.init = function(){
  resultSet.status = "";
  resultSet.message = "";
  resultSet.datacount = 0;
  resultSet.dataTotalCount = 0;
  resultSet.currentpage = 0;
  resultSet.jsData  = [];
};

exports.set = function(key,value){
  resultSet[key] = value;
};

exports.get = function(key){
  return resultSet[key];
};

exports.getAll = function(){
  return resultSet;
};
