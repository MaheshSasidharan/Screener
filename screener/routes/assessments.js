var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var path = require('path');
var fs = require("fs");
var glob = require("glob");
var google_speech = require('google-speech');
var speech = require('google-speech-api');
const Speech = require('@google-cloud/speech');

//var multiparty = require('../node_modules/multiparty/index');
var multiparty = require('multiparty');
var Helper = require('../CommonFactory/helper');
var Constants = require('../CommonFactory/constants');

//var multipartyMiddleware = multiparty();

/* GET users listing. */
router.get('/', function(req, res, next) {
    // Your Google Cloud Platform project ID
    const projectId = 'elliptical-tree-158319';

    // Instantiates a client
    const speechClient = Speech({
        projectId: projectId
    });
    var fileName = '/home/sasidharan/Documents/Projects/Screener/Server/screener/bin/test/test.flac';

    // The audio file's encoding and sample rate
    const options = {
        encoding: 'FLAC', // 'LINEAR16',
        sampleRate: 44100 // 16000
    };

    // Detects speech in the audio file
    speechClient.recognize(fileName, options)
        .then((results) => {
            const transcription = results[0];
            console.log(`Transcription: ${transcription}`);
        }, function(err) {
            console.log(err);
        });
    return;
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
                    SaveResponseFile(arrInserts, req);
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
                        if (!(--pendingUpdates)) {
                            SaveResponseFile(arrUpdates, req);
                            res.json({ status: true, message: "Updated" });
                        }
                    }
                };
                handle_database(req, res, params);
            });
        }
    }
});

function SaveResponseFile(oSaveItem, req) {
    var oResponse = [];
    oSaveItem.forEach(function(oItem) {
        oResponse.push({
            questionId: oItem.questionId,
            response: oItem.response
        });
    });

    var oTempSaveItem = {
        dCreateDateTime: new Date(),
        dModifiedDateTime: new Date(),
        oResponse: oResponse
    };

    // Create folder for user if it does not exist
    var userDir = req.session.id;
    Helper.CreateUserDirectories(userDir, false);

    var pattern = 'AllUsersAssessments/' + userDir.toString() + "/text/" + "ResponseData.json";
    var mg = new glob.Glob(pattern, { 'nocase': true }, cb);

    function cb(er, files) {
        if (files.length) { // Found matches
            if (files.length > 1) { // Found multiple matches
                res.json({ code: 405, status: false, msg: "Multiple matches found" });
            }
            var filePath = files[0];
            fs.readFile(filePath, function read(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    obj = JSON.parse(data); //now it an object

                    oResponse.forEach(function(oItem) {

                        if (oItem.questionId === 7 || oItem.questionId === 8 || oItem.questionId === 11 || oItem.questionId === 18) {
                            oItem.response = JSON.parse(oItem.response);
                        }

                        var nIndiResponseIndex = Helper.FindItemInArray(obj.oResponse, 'questionId', oItem.questionId, 'index');
                        if (nIndiResponseIndex !== null) {
                            obj.oResponse[nIndiResponseIndex] = oItem;
                        } else {
                            obj.oResponse.push(oItem);
                        }
                    });
                    obj.dModifiedDateTime = new Date();

                    json = JSON.stringify(obj); //convert it back to json
                    fs.writeFile(filePath, json, 'utf8');
                }
            });
        } else {
            var json = JSON.stringify(oTempSaveItem);
            fs.writeFile(pattern, json, 'utf8');
        }
    }
}

router.post('/AudioUpload', function(req, res, next) {
    if (req.body.oSaveItem) {
        // Create folder for user if it does not exist
        var userDir = req.session.id;
        Helper.CreateUserDirectories(userDir, false);
        var buf = new Buffer(req.body.oSaveItem.blob, 'base64'); // decode
        Helper.SaveFileToDisk(["AllUsersAssessments", userDir, "audio", "voiceAssessment", req.body.oSaveItem.character + ".wav"], buf, res);
    } else {
        return res.json({ status: false });
    }
});

router.post('/AudioUploadWord', function(req, res, next) {
    if (req.body.oSaveItem) {
        var sourceFolderName = 'AssessmentAssets/soundClips';
        // Create folder for user if it does not exist
        var userDir = req.session.id;
        Helper.CreateUserDirectories(userDir, false);

        var nAssmntNum = req.body.oSaveItem.sVoicePrefix;
        var pattern = sourceFolderName + "/" + nAssmntNum + "_[a-z0-9]*.mp3";
        var mg = new glob.Glob(pattern, { 'nocase': true }, cb);

        function cb(er, files) {
            if (files.length) { // Found matches
                if (files.length > 1) { // Found multiple matches
                    res.json({ code: 405, status: false, msg: "Multiple matches found" });
                }
                var fileName = files[0].split(sourceFolderName + '/')[1];
                fileName = fileName.split(".mp3")[0];
                var buf = new Buffer(req.body.oSaveItem.blob, 'base64'); // decode
                Helper.SaveFileToDisk(["AllUsersAssessments", userDir, "audio", "audioAssessment", fileName + ".wav"], buf, res);
            } else {
                res.json({ code: 404, status: false, msg: "File not found" });
            }
        }
    } else {
        return res.json({ status: false });
    }
});

router.get('/GetAudioAssessment', function(req, res, next) {
    var nAssmntNum = req.query.nAssmntNum;
    var pattern = "AssessmentAssets/soundClips/" + nAssmntNum + "_[a-z0-9]*.mp3";
    var mg = new glob.Glob(pattern, { 'nocase': true }, cb);

    function cb(er, files) {
        if (files.length) { // Found matches
            if (files.length > 1) { // Found multiple matches
                res.json({ code: 405, status: false, msg: "Multiple matches found" });
            }
            res.set({ 'Content-Type': 'audio/mp3' });
            var root = __dirname.split('/routes')[0];
            var filepath = path.resolve(root + "/bin/" + files[0]);
            var readStream = fs.createReadStream(filepath);
            readStream.pipe(res);
        } else {
            res.json({ code: 404, status: false, msg: "File not found" });
        }
    }
});

router.get('/GetSyncVoiceAssessment', function(req, res, next) {
    var nAssmntNum = req.query.nAssmntNum;
    var pattern = "AssessmentAssets/syncVoice/" + nAssmntNum + "_[a-z]*.wav";
    var mg = new glob.Glob(pattern, { 'nocase': true }, cb);

    function cb(er, files) {
        if (files.length) { // Found matches
            if (files.length > 1) { // Found multiple matches
                res.json({ code: 405, status: false, msg: "Multiple matches found" });
            }
            res.set({ 'Content-Type': 'audio/mpeg' });
            var root = __dirname.split('/routes')[0];
            var filepath = path.resolve(root + "/bin/" + files[0]);
            var readStream = fs.createReadStream(filepath);
            readStream.pipe(res);
        } else {
            res.json({ code: 404, status: false, msg: "File not found" });
        }
    }
});

router.post('/AudioSyncVoiceUpload', function(req, res, next) {
    if (req.body.oSaveItem) {
        var sourceFolderName = 'AssessmentAssets/syncVoice';
        // Create folder for user if it does not exist
        var userDir = req.session.id;
        Helper.CreateUserDirectories(userDir, false);

        var nAssmntNum = req.body.oSaveItem.sVoicePrefix;
        var pattern = sourceFolderName + "/" + nAssmntNum + "_[a-z]*.wav";
        var mg = new glob.Glob(pattern, { 'nocase': true }, cb);

        function cb(er, files) {
            if (files.length) { // Found matches
                if (files.length > 1) { // Found multiple matches
                    res.json({ code: 405, status: false, msg: "Multiple matches found" });
                }
                var fileName = files[0].split(sourceFolderName + '/')[1];
                var buf = new Buffer(req.body.oSaveItem.blob, 'base64'); // decode
                Helper.SaveFileToDisk(["AllUsersAssessments", userDir, "audio", "syncVoiceAssessment", fileName], buf, res);
            } else {
                res.json({ code: 404, status: false, msg: "File not found" });
            }
        }
    } else {
        return res.json({ status: false });
    }
});

router.post('/AudioPicturePromptVoiceUpload', function(req, res, next) {
    if (req.body.oSaveItem) {
        // Create folder for user if it does not exist
        var userDir = req.session.id;
        Helper.CreateUserDirectories(userDir, false);

        // Next create only folders related to Picture Prompt
        var sSetName = req.body.oSaveItem.sSetName;

        var picturePromptDir = userDir + "/audio" + "/picturePromptAssessment" + "/" + sSetName;
        Helper.CreateUserDirectories(picturePromptDir, true);

        var sPicName = req.body.oSaveItem.sPicName + ".wav";
        var buf = new Buffer(req.body.oSaveItem.blob, 'base64'); // decode
        Helper.SaveFileToDisk(["AllUsersAssessments", userDir, "audio", "picturePromptAssessment", sSetName, sPicName], buf, res);
    } else {
        return res.json({ status: false });
    }
});

router.get('/GetPicNamesMatrixAssessment', function(req, res, next) {
    var initPath = "AssessmentAssets/matrixPics/";
    var pattern = initPath + "**/*";
    var mg = new glob.Glob(pattern, { 'nocase': true }, cb);

    function cb(er, files) {
        if (files.length) {
            var arrPicNames = [];
            files.forEach(function(filePath) {
                filePath = filePath.substring(filePath.indexOf(initPath) + initPath.length);
                //if (filePath.indexOf(".") >= 0) {
                arrPicNames.push(filePath);
                //}
            });
            res.json({ status: true, arrPicNames: arrPicNames });
        } else {
            res.json({ code: 404, status: false, msg: "File not found" });
        }
    }
});

router.get('/GetMatrixAssessment', function(req, res, next) {
    var sSetName = req.query.sSetName;
    var sSetType = req.query.sSetType;
    var sPicName = req.query.sPicName;
    var pattern = "AssessmentAssets/matrixPics/" + sSetName + "/" + sSetType + "/" + sPicName;
    var mg = new glob.Glob(pattern, { 'nocase': true }, cb);

    function cb(er, files) {
        if (files.length) { // Found matches
            if (files.length > 1) { // Found multiple matches
                res.json({ code: 405, status: false, msg: "Multiple matches found" });
            }
            var root = __dirname.split('/routes')[0];
            var img = fs.readFileSync(root + "/bin/" + files[0]);
            var fileExtenstion = files[0].substring(files[0].indexOf(".") + 1);
            res.writeHead(200, { 'Content-Type': 'image/' + fileExtenstion });
            res.end(img, 'binary');
        } else {
            res.json({ code: 404, status: false, msg: "File not found" });
        }
    }
});

router.get('/GetPicNamesPicturePrompt', function(req, res, next) {
    var initPath = "AssessmentAssets/picturePrompt/";
    var pattern = initPath + "**/*";
    var mg = new glob.Glob(pattern, { 'nocase': true }, cb);

    function cb(er, files) {
        if (files.length) {
            var arrPicNames = [];
            files.forEach(function(filePath) {
                filePath = filePath.substring(filePath.indexOf(initPath) + initPath.length);
                //if (filePath.indexOf(".") >= 0) {
                arrPicNames.push(filePath);
                //}
            });
            res.json({ status: true, arrPicNames: arrPicNames });
        } else {
            res.json({ code: 404, status: false, msg: "File not found" });
        }
    }
});

router.get('/GetPicturePromptAssessment', function(req, res, next) {
    var sSetName = req.query.sSetName;
    var sPicName = req.query.sPicName;
    var pattern = "AssessmentAssets/picturePrompt/" + sSetName + "/" + sPicName;
    var mg = new glob.Glob(pattern, { 'nocase': true }, cb);

    function cb(er, files) {
        if (files.length) { // Found matches
            if (files.length > 1) { // Found multiple matches
                res.json({ code: 405, status: false, msg: "Multiple matches found" });
            }
            var root = __dirname.split('/routes')[0];
            var img = fs.readFileSync(root + "/bin/" + files[0]);
            var fileExtenstion = files[0].substring(files[0].indexOf(".") + 1);
            res.writeHead(200, { 'Content-Type': 'image/' + fileExtenstion });
            res.end(img, 'binary');
        } else {
            res.json({ code: 404, status: false, msg: "File not found" });
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
