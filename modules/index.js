var mssql = require('mssql');
var commons = require('./commons');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('../config.json', 'UTF-8'));
delete config.bingkey;
var connection = new mssql.Connection(config);
var status = false;

exports.con = connection;
exports.status = status;

connection.connect(function(err){
  status = (err ? false : true);
  if (status) {
      console.log("NeoHerb Database connected");
  }else console.log("NeoHerb Database disconnected");
});

connection.on('err',function(err){
  console.log(err);
});

exports.isconnected = function(callback){
  callback(connection.connecting);
};

/* 서버 재연결 */
exports.reconnect = function(callback){
  connection.connect(function(err){
    callback(err);
  });
};

exports.getrecordset = function(query, callback){
	if(!connection.connected){
		exports.reconnect(function(err){
			console.log("Can't Connect NeoHurb Database ", err);
		});
	}

	var rs = new mssql.Request(connection);
	rs.query(query,function(err, recordset){
		callback(err, recordset);
	});
};

exports.executeProcedure = function(inputs, procedure, callback){
	var rs = new mssql.Request(connection);
	var item;
	if(!commons.isNone(inputs)){
		for(item in inputs){
			if(inputs[item] !== undefined){        
				rs.input(item + "", inputs[item] + "");
			}
		}
	}
  rs.execute(procedure, function(err, recordsets, returnValue){
		callback(err, recordsets, returnValue);
	});
};

exports.execute = function(query, callback){
	var trans = new mssql.Transaction(connection);
	trans.begin(function(err){
		if(err){
			 callback(err);
			 return;
		}

		var rolledback = false;
		trans.on('rollback', function(aborted){
			rolledback = true;
		});

		var rs = new mssql.Request(trans);
		rs.query(query, function(err, recordset){
			if(err){
				if(!rolledback){
					trans.rollback(function(err){
						console.log("query is rollbacked because of ", err);
					});
				}
				callback(err);
				return;
			}

			trans.commit(function(err){
				if(err){
					callback(err);
					return;
				}
				console.log("query is commited successfully");
				callback(null,recordset);
			});
		});

	});
};
