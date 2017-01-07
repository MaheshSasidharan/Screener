app.controller('PicturePrompt', ['$scope', '$timeout', '$interval', 'Factory_Constants', 'Factory_CommonRoutines', 'Factory_DataService', PicturePrompt]);

function PicturePrompt($scope, $timeout, $interval, Constants, CommonFactory, DataService) {
    var pp = this;
    $scope.$parent.vm.Helper.ShowHidePager(false);

    pp.audioRecordLength = Constants.PicturePrompt.audioRecordLength;

    pp.src = null;
    var arrImages = null;
    var arrImageResponse = [];
    var responseTime = null;

    pp.arrVoiceOPAndIP = [];
    pp.nCurrentPicSetIndex = 0;
    pp.nCurrentPicIndex = 0;
    pp.oCurrentPic = null;
    pp.bShowNextButton = false;

    pp.bShowCurrentPic = false;

    pp.oAudioRecorder = {
        recorded: null,
        timeLimit: pp.audioRecordLength,
        autoStart: false,
        StartRecorderCountDown: function() {
            var nTimer = 3;
            pp.displayedResponse = nTimer;
            var oIntervalPromise = $interval(function() {
                if (nTimer == 0) {
                    //if (nTimer == 3) {
                    pp.oAudioRecorder.recorded = null;
                    pp.displayedResponse = null;
                    pp.oAudioRecorder.autoStart = true;
                    $interval.cancel(oIntervalPromise);
                    pp.bShowCurrentPic = false;
                } else {
                    pp.displayedResponse = --nTimer;
                }
            }, 1000, 4);
        },
        OnRecordStart: function() {
            console.log("RECORDING STARTED");
        },
        OnRecordAndConversionComplete: function() {
            console.log("RECORDING Ended");
            $timeout(function() {
                pp.oAudioRecorder.autoStart = false;
                pp.oCurrentPic.oResponseVoice = pp.oAudioRecorder.recorded;
                pp.oCurrentPic.sStatus = 'responseAdded';
                if (arrImages.length == pp.nCurrentPicSetIndex + 1 && arrImages[pp.nCurrentPicSetIndex].arroPics.length == pp.nCurrentPicIndex) {
                	pp.Helper.GetPicturePrompt(); // If all images have been shown then transition to next assessment
                } else {
                    pp.bShowNextButton = true;
                }
                pp.oService.AudioPicturePromptVoiceUpload();
            }, 0);
        }
    }

    pp.oService = {
        GetSourceAddress: function() {
            return DataService.GetSourceAddress();
        },
        GetPicNamesPicturePrompt: function() {
            return DataService.GetPicNamesPicturePrompt().then(function(data) {
                if (data.status) {
                    return data.arrPicNames;
                } else {
                    alert(data.msg);
                    return [];
                }
            });
        },
        AudioPicturePromptVoiceUpload: function() {
            var oResponse = pp.oCurrentPic;
            console.log(oResponse);
            //return;
            CommonFactory.BlobToBase64(oResponse.oResponseVoice, function(base64) { // encode
                var oSaveItem = { 'blob': base64, 'sSetName': oResponse.sSetName, 'sPicName': oResponse.sPicName };
                DataService.AudioPicturePromptVoiceUpload(oSaveItem).then(function(data) {
                    if (data.status) {
                        oResponse.sStatus = 'saved';
                    } else {
                        oResponse.sStatus = 'failed';
                    }
                });
            });
        }
    }

    pp.Helper = {
        Init: function() {
            pp.oService.GetPicNamesPicturePrompt().then(function(arrPicNames) {
                if (arrPicNames.length) {
                    arrPicNames.forEach(function(sPicName) {
                        var nNumberOfSlashes = (sPicName.match(/\//g) || []).length;
                        switch (nNumberOfSlashes) {
                            case 0:
                                var sSetName = sPicName;
                                if (!arrImages) {
                                    arrImages = [];
                                }
                                arrImages.push({ sSetName: sSetName });
                                break;
                            case 1:
                                var sSetName = sPicName.substring(0, sPicName.lastIndexOf("/"));
                                if (!arrImages[arrImages.length - 1].arroPics) {
                                    arrImages[arrImages.length - 1].arroPics = [];
                                }
                                var sSource = pp.oService.GetSourceAddress();
                                var sMatrixAssessment = sSource + "GetPicturePromptAssessment";

                                var sTempSetName = arrImages[arrImages.length - 1].sSetName;
                                var sTempPicName = sPicName.substr(sPicName.indexOf("/") + 1);
                                var sTempPicURL = sMatrixAssessment + "?sSetName=" + sTempSetName + "&sPicName=" + sTempPicName;
                                var oPic = {
                                	sSetName: sTempSetName,
                                    sPicName: sTempPicName,
                                    sPicURL: sTempPicURL,
                                    oResponseVoice: null,
                                    sStatus: 'created'
                                }
                                arrImages[arrImages.length - 1].arroPics.push(oPic);

                                break;
                        }
                    });
                    arrImages = CommonFactory.RandomizeSolutionSet(arrImages, 'PicturePrompt');
                }
                pp.Helper.GetPicturePrompt();
            });
        },
        GetPicturePrompt: function() {
            if (arrImages[pp.nCurrentPicSetIndex].arroPics[pp.nCurrentPicIndex]) {
                pp.oCurrentPic = arrImages[pp.nCurrentPicSetIndex].arroPics[pp.nCurrentPicIndex++];
                pp.bShowCurrentPic = true;
                pp.bShowNextButton = false;
            } else {
                pp.nCurrentPicSetIndex++;
                pp.nCurrentPicIndex = 0;
                if (arrImages.length === pp.nCurrentPicSetIndex) {
                    pp.oCurrentSet = null;
                    pp.bShowNextButton = false;
                    $scope.$parent.vm.Helper.ShowHidePager(true, Constants.Miscellaneous.AssessmentCompleteNext);
                    return;
                } else {
                    pp.oCurrentPic = arrImages[pp.nCurrentPicSetIndex].arroPics[pp.nCurrentPicIndex++];
                    pp.bShowCurrentPic = true;
                    pp.bShowNextButton = false;
                }
            }
            pp.oAudioRecorder.StartRecorderCountDown();
        },
    }
    pp.Helper.Init();

}
