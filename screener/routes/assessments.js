var express = require('express');
var mysql = require('mysql');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/GetAssessments', function(req, res, next) {
	handle_database(req,res);
});

router.post('/SaveAssessments', function(req, res) {
    var name = req.body.oSaveItem;
});

var env = process.env.NODE_ENV || 'development';
var config = require('../config')[env];
var pool = mysql.createPool(config.poolConfig);

function handle_database(req,res) {
    
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }
        var TEMPwhereVals = [req.session.id];
        var whereVals = [1];
        connection.query("SELECT questionId, question, assessmentId, nickName, name, description FROM vw_AssessmentQuestions"
			, whereVals
        	,function(err,rows){
            connection.release();
            if(!err) {
                res.json({status: true, assessments: rows});
            }else{
            	res.json({status: false, msg: "Could not get assessments. :("});
            }
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
}


module.exports = router;