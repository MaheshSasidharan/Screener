app.controller('PicturePrompt', ['$scope', '$timeout', '$interval', 'Factory_Constants', 'Factory_CommonRoutines', 'Factory_DataService', PicturePrompt]);

function PicturePrompt($scope, $timeout, $interval, Constants, CommonFactory, DataService) {
    var pp = this;
    var bFirst = true;

    pp.audioRecordLength = Constants.PicturePromptAssessment.audioRecordLength;

    pp.sTextOnPlayButton = "Start Practice";
    pp.src = null;
    var arrImages = null;
    var arrImageResponse = [];
    var responseTime = null;

    pp.arrVoiceOPAndIP = [];
    pp.nCurrentPicSetIndex = 0;
    pp.nCurrentPicIndex = 0;
    pp.oCurrentPic = null;

    pp.bShowCurrentPic = false;


    pp.oAudio = {
        bShowStartButton: true,
        bShowProgressBar: false,
        nMaxTime: pp.audioRecordLength * 1000,
        nSpentTime: 0,
        nRefreshRate: 500,
        sType: null,
        displayedResponse: null,
        StartProgressBar: function() {
            this.bShowProgressBar = true;
            this.sType = null;
            var that = this;
            var counter = 0;
            oIntervalPromise = $interval(function() {
                counter++;                
                if (that.nSpentTime + that.nRefreshRate == that.nMaxTime) {
                    $interval.cancel(oIntervalPromise);
                    // Let progress reach 100% on UI. So increase by nSpentTime by one more step and reset to zero after one second
                    that.nSpentTime += that.nRefreshRate;                    
                    console.log(new Date() - time);
                    $timeout(function() {
                        // Give a gap of 1 second
                        that.nSpentTime = 0;
                        that.bShowProgressBar = false;
                        console.log(new Date() - time);
                    }, 1000);
                    // This timeout delay and progress bar animation speed should be the same
                } else {
                    //that.sType = CommonFactory.GetProgressType(that.nSpentTime, that.nMaxTime);
                    that.nSpentTime += that.nRefreshRate;
                }
            }, this.nRefreshRate, (this.nMaxTime / this.nRefreshRate));
        }
    }

    var time = null;

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
                    $timeout(function() {
                        pp.oAudio.StartProgressBar();
                    }, Constants.Assessments.ProgressStartDelay);
                    time = new Date();
                    console.log(time);
                    $interval.cancel(oIntervalPromise);
                    pp.bShowCurrentPic = true;
                } else {
                    pp.displayedResponse = --nTimer;
                }
            }, 1000, 4);
        },
        OnRecordStart: function() {
            //console.log("RECORDING STARTED");
        },
        OnRecordAndConversionComplete: function() {
            console.log("RECORDING Ended");
            $timeout(function() {
                pp.bShowCurrentPic = false;
                pp.oAudioRecorder.autoStart = false;
                pp.oCurrentPic.oResponseVoice = pp.oAudioRecorder.recorded;
                pp.oCurrentPic.sStatus = 'responseAdded';
                if (arrImages.length == pp.nCurrentPicSetIndex + 1 && arrImages[pp.nCurrentPicSetIndex].arroPics.length == pp.nCurrentPicIndex) {
                    pp.Helper.GetPicturePrompt(); // If all images have been shown then transition to next assessment
                } else {
                    //pp.bShowNextButton = true;
                    pp.oAudio.bShowStartButton = true;
                    $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Final";
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
            // Hide NextAssessment button
            $scope.$parent.vm.Helper.ShowHidePager(false);
            // Turn on practice mode
            $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Practice";

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
            });
        },
        PlayNext: function(sType) {
            if (sType == "next") {
                pp.Helper.GetPicturePrompt();
                if (bFirst) {
                    pp.sTextOnPlayButton = "Start";
                    bFirst = false;
                } else {
                    //$scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Final";
                    pp.sTextOnPlayButton = "Next";
                }
            }
        },
        GetPicturePrompt: function() {
            if (arrImages[pp.nCurrentPicSetIndex].arroPics[pp.nCurrentPicIndex]) {
                pp.oCurrentPic = arrImages[pp.nCurrentPicSetIndex].arroPics[pp.nCurrentPicIndex++];
                //pp.bShowCurrentPic = true;
                //pp.bShowNextButton = false;
                pp.oAudio.bShowStartButton = false;
            } else {
                pp.nCurrentPicSetIndex++;
                pp.nCurrentPicIndex = 0;
                if (arrImages.length === pp.nCurrentPicSetIndex) {
                    pp.oCurrentSet = null;
                    pp.oAudio.bShowStartButton = false;
                    $scope.$parent.vm.Helper.ShowHidePager(true, Constants.Miscellaneous.AssessmentCompleteNext);
                    return;
                } else {
                    pp.oCurrentPic = arrImages[pp.nCurrentPicSetIndex].arroPics[pp.nCurrentPicIndex++];
                    //pp.bShowCurrentPic = true;
                    //pp.bShowNextButton = false;
                    pp.oAudio.bShowStartButton = false;
                }
            }
            pp.oAudioRecorder.StartRecorderCountDown();
        },
    }
    pp.Helper.Init();
}
