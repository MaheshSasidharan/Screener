// Database manager
var mysql = require('mysql');

var GetPool = function () {
	var env = process.env.NODE_ENV || 'development';
	var config = require('../config')[env];
	return mysql.createPool(config.poolConfig);
}

var AddUser = function(user, callback) {
    DB.pool.getConnection(function(err,connection){
        if (err) {
          res.json({code : 100, status : false, msg :"Error in connection database"});
          return;
        }   
        //if(res && res.locals){}
        var insertVals = user;
		connection.query('INSERT INTO User SET ?', insertVals, function(err, result) {
		  if (err) throw err;
		  console.log(result.insertId);
		  callback(err, result.insertId);		  
		});

        connection.on('error', function(err) {      
              res.json({code : 100, status : false, msg :"Error in connection database"});
              return;     
        });
  	});
}

var FindUser = function(id, callback) {
    DB.pool.getConnection(function(err,connection){
        if (err) {
          res.json({code : 100, status : false, msg :"Error in connection database"});
          return;
        }
        var whereVals = [id];
		connection.query('SELECT * FROM User where id = ? LIMIT 1'
			, whereVals
			, function(err, result) {
			  if (err) throw err;
			  console.log(result);
			  callback(err, result);		  
		});

        connection.on('error', function(err) {      
              res.json({code : 100, status : false, msg :"Error in connection database"});
              return;     
        });
  	});
}

var DB = {
	pool: GetPool(),
	AddUser: AddUser,
	FindUser: FindUser
}

module.exports = DB;