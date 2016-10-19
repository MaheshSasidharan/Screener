var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var Helper = require('../CommonFactory/helper');
var Constants = require('../CommonFactory/constants');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/GetAssessments', function(req, res, next) {
    var params = {
        errors: {
            errors_101: Constants.Errors._101,
            queryFailed: Constants.Errors.Assessments.GetAssessmentQuestionFailed
        },
        query: Constants.Queries.Assessments.GetAssessmentQuestions.query,
        callback: function(rows) {
            if (rows && rows.length) {
                //res.json({status: true, assessments: rows});
                var params = {
                    errors: {
                        errors_101: Constants.Errors._101,
                        queryFailed: Constants.Errors.Assessments.GetAssessmentResponseFailed
                    },
                    query: Constants.Queries.Assessments.GetAssessmentResponse.query,
                    whereVals: [req.session.id],
                    callback: function(rowsInner) {
                        if (rowsInner && rowsInner.length) {
                            rowsInner.forEach(function(oResponse) {
                                if (oResponse.questionId) {
                                    var index = Helper.FindItemInArray(rows, "questionId", oResponse.questionId, "index");
                                    if (index != null) {
                                        rows[index].response = oResponse.response;
                                        rows[index].responseTextId = oResponse.responseTextId;
                                    }
                                }
                            });
                        }
                        res.json({ status: true, assessments: rows });
                    }
                };
                handle_database(req, res, params);
            } else {
                res.json({ status: false, msg: Constants.Errors.Assessments.GetAssessmentResponseFailed });
            }
        }
    };
    handle_database(req, res, params);
});

router.post('/SaveAssessments', function(req, res) {
    var oSaveItem = req.body.oSaveItem;
    if (oSaveItem && oSaveItem.length) {
        var arrInserts = [];
        var arrUpdates = [];
        oSaveItem.forEach(function(oItem) {
            if (oItem.responseTextId) {
                arrUpdates.push(oItem);
            } else {
                arrInserts.push(oItem);
            }
        });

        if (arrInserts.length) {
            var whereVals = [];
            arrInserts.forEach(function(oItem) {
                whereVals.push([req.session.id, oItem.questionId, oItem.response]);
            });
            var params = {
                sType: "BulkInsert",
                errors: {
                    errors_101: Constants.Errors._101,
                    queryFailed: Constants.Errors.Assessments.SaveAssessmentFailed
                },
                query: Constants.Queries.Assessments.InsertResponse.query,
                whereVals: whereVals,
                callback: function(rowsInner) {
                    console.log(rowsInner);
                    res.json({ status: true, insertedId: rowsInner, message: "Inserted" });
                }
            };
            handle_database(req, res, params);
        }

        if (arrUpdates.length) {
            // If we have something to be updated
            var whereVals = null;
            var pendingUpdates = arrUpdates.length;
            arrUpdates.forEach(function(oItem) {
                whereVals = [{ response: oItem.response }, oItem.responseTextId];
                var params = {
                    sType: "IndividualUpdate",
                    errors: {
                        errors_101: Constants.Errors._101,
                        queryFailed: Constants.Errors.Assessments.SaveAssessmentFailed
                    },
                    query: Constants.Queries.Assessments.UpdateResponse.query,
                    whereVals: whereVals,
                    callback: function(rowsInner) {
                        console.log(rowsInner);
                        if (!(--pendingUpdates)) {
                            res.json({ status: true, message: "Updated" });
                        }
                    }
                };
                handle_database(req, res, params);
            });
        }
    }
});

var env = process.env.NODE_ENV || 'development';
var config = require('../config')[env];
var pool = mysql.createPool(config.poolConfig);

function handle_database(req, res, params) {
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json(params.errors.errors_101);
            return;
        }
        switch (params.sType) {
            case "BulkInsert":
                connection.query(params.query, [params.whereVals], function(err, rows) {
                    connection.release();
                    if (!err) {
                        params.callback(rows);
                    } else {
                        res.json({ status: false, msg: params.errors.queryFailed });
                    }
                });
                break;
            case "IndividualUpdate":
                connection.query(params.query, params.whereVals, function(err, rows) {
                    connection.release();
                    if (!err) {
                        params.callback(rows);
                    } else {
                        res.json({ status: false, msg: params.errors.queryFailed });
                    }
                });
                break;
            default:
                connection.query(params.query, params.whereVals, function(err, rows) {
                    connection.release();
                    if (!err) {
                        params.callback(rows);
                    } else {
                        res.json({ status: false, msg: params.errors.queryFailed });
                    }
                });
        }

        connection.on('error', function(err) {
            res.json(params.errors.errors_101);
            return;
        });
    });
}


module.exports = router;