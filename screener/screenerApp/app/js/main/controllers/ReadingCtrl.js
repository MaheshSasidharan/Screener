app.controller('ReadingController', ['$scope', '$timeout', '$interval', '$sce', 'Factory_Constants', 'Factory_CommonRoutines', 'Factory_DataService', ReadingController]);

function ReadingController($scope, $timeout, $interval, $sce, Constants, CommonFactory, DataService, Upload) {
    var re = this;
    var bFirst = true;
    re.bShowStartButton = false;
    re.sTextOnPlayButton = "Start";
    var sParagraph = null;
    var sInstruction = null;
    var sParagraphType = null;
    var arrParagraphs = Constants.ReadingAssessment.arrParagraphs;
    var nTotalRounds = arrParagraphs.length;

    re.SoundBuffer = null;
    var oIntervalPromise = null;
    var context = DataService.CreateOrGetContext();
    var source = context.createBufferSource(); // creates a sound source    

    re.TestAudio = null;
    re.arrBuffers = null;

    var nCurrentRound = -1;
    var nInstructionManagerCounter = -1;
    var audioIndex = -1;

    re.oService = {
        ReadingUpload: function(sParagraphType) {
            CommonFactory.BlobToBase64(re.oAudioRecorder.recorded, function(base64) { // encode
                var oSaveItem = { 'blob': base64, 'character': sParagraphType };
                DataService.ReadingUpload(oSaveItem).then(function(data) {

                });
            });
        }
    }

    re.oAudio = {
        bShowStartButton: false,
        bShowProgressBar: false,
        sParagraph: null,
        bShowInstructionText: false,
        sInstruction: null,
        nMaxTime: null,
        nSpentTime: 0,
        nRefreshRate: 500,
        sType: null,
        displayedResponse: null,
        StartProgressBar: function() {
            this.bShowProgressBar = true;
            this.sType = null;
            var that = this;
            var oIntervalPromise = $interval(function() {
                if (that.nSpentTime + that.nRefreshRate == that.nMaxTime) {
                    $interval.cancel(oIntervalPromise);
                    // Let progress reach 100% on UI. So increase by nSpentTime by one more step and reset to zero after one second
                    that.nSpentTime += that.nRefreshRate;
                    $timeout(function() {
                        // Give a gap of 1 second
                        that.nSpentTime = 0;
                        that.bShowProgressBar = false;
                    }, 1000);
                } else {
                    //that.sType = CommonFactory.GetProgressType(that.nSpentTime, that.nMaxTime);
                    that.nSpentTime += that.nRefreshRate;
                }
            }, this.nRefreshRate, this.nMaxTime / this.nRefreshRate);
        }
    }

    re.Helper = {
        Init: function() {
            // Hide NextAssessment button
            $scope.$parent.vm.Helper.ShowHidePager(false);
            // Turn on practice mode
            $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Final"; // "Practice"; No practice for this assessment
            $scope.$parent.vm.EndOfAudioPlayCallback = this.AfterInstructionPlayed;
        },
        AfterInstructionPlayed: function() {
            nInstructionManagerCounter++;
            if (nCurrentRound === -1 && nInstructionManagerCounter === 0) {
                nCurrentRound++;
                $scope.$parent.vm.Helper.GetNextAudioInstructionFromList();
                re.oAudio.sInstruction = arrParagraphs[nCurrentRound].sInstruction;
                re.oAudio.bShowInstructionText = true;
            }
            if (nCurrentRound === 0 && nInstructionManagerCounter === 1) {
                re.bShowStartButton = true;
            }
            if (nCurrentRound === 1 && nInstructionManagerCounter === 2) {
                re.bShowStartButton = true;
            }
            if (nCurrentRound === 2 && nInstructionManagerCounter === 3) {
                re.bShowStartButton = true;
            }
        },
        PlayNext: function(sType) {
            if (sType == "next") {                
                re.bShowStartButton = false;
                re.oAudio.bShowInstructionText = false;
                sParagraph = arrParagraphs[nCurrentRound].sParagraph;
                sParagraphType = arrParagraphs[nCurrentRound].sParagraphType;
                var nRecordLength = arrParagraphs[nCurrentRound].RecordLength;
                nCurrentRound++;
                re.oAudio.nMaxTime = nRecordLength * 1000;
                re.oAudioRecorder.timeLimit = nRecordLength;
                re.oAudioRecorder.StartRecorderCountDown();
                if (bFirst) {
                    re.sTextOnPlayButton = "Next";
                    bFirst = false;
                } else {
                    re.sTextOnPlayButton = "Next";
                }
            }
        }
    }

    re.oAudioRecorder = {
        recorded: null,
        timeLimit: 3, // make this 3
        autoStart: false,
        StartRecorderCountDown: function() {
            var nTimer = 3; // make this 3
            re.oAudio.displayedResponse = nTimer;
            var oIntervalPromise = $interval(function() {
                if (nTimer == 0) {
                    re.oAudioRecorder.recorded = null;;
                    re.oAudio.displayedResponse = null;
                    re.oAudio.sParagraph = sParagraph;
                    // re.oAudio.sInstruction = null;;
                    re.oAudio.bShowInstructionText = false;
                    re.oAudioRecorder.autoStart = true;
                    $timeout(function() {
                        re.oAudio.StartProgressBar();
                    }, Constants.Assessments.ProgressStartDelay);
                    $interval.cancel(oIntervalPromise);
                } else {
                    re.oAudio.displayedResponse = --nTimer;
                }
            }, 1000, 4);
        },
        OnRecordStart: function() {
            //console.log("RECORDING STARTED");
        },
        OnRecordAndConversionComplete: function() {
            $timeout(function() {
                re.oService.ReadingUpload(sParagraphType);
                if (nCurrentRound === nTotalRounds) {
                    $scope.$parent.vm.Helper.ShowHidePager(true, Constants.Miscellaneous.AssessmentCompleteNext);
                    //re.oAudio.sInstruction = null;
                    re.oAudio.bShowInstructionText = false;
                } else {
                    $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Final";
                    re.oAudio.sInstruction = arrParagraphs[nCurrentRound].sInstruction;
                    re.oAudio.bShowInstructionText = true;
                    $scope.$parent.vm.Helper.GetNextAudioInstructionFromList();
                }

                re.oAudio.sParagraph = null;
                re.oAudio.displayedResponse = null;
                re.oAudioRecorder.autoStart = false;

                // Stop Progress bar
                re.oAudio.nSpentTime = 0;
                re.oAudio.bShowProgressBar = false;
            }, 0);
        }
    }

    re.Helper.Init();
}
