app.controller('VoiceController', ['$scope', '$timeout', '$interval', '$sce', 'Factory_Constants', 'Factory_CommonRoutines', 'Factory_DataService', VoiceController]);

function VoiceController($scope, $timeout, $interval, $sce, Constants, CommonFactory, DataService, Upload) {
    var vo = this;
    var bFirst = true;
    vo.bShowStartButton = true;
    vo.sTextOnPlayButton = "Start Practice";
    var cRandomCharacter = null;
    var arrCharacters = Constants.VoiceAssessment.arrCharacters;
    var nCurrentRound = 0;
    var nTotalRounds = arrCharacters.length;

    vo.SoundBuffer = null;
    var oIntervalPromise = null;
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var source = context.createBufferSource(); // creates a sound source
    var oAudioAssessment = $scope.$parent.vm.assessments[7].arrQuestions[0];

    vo.TestAudio = null;
    vo.arrBuffers = null;

    var audioIndex = -1;

    vo.oService = {
        AudioUpload: function(sRandomCharacter) {
            CommonFactory.BlobToBase64(vo.oAudioRecorder.recorded, function(base64) { // encode
                var oSaveItem = { 'blob': base64, 'character': sRandomCharacter };
                DataService.AudioUpload(oSaveItem).then(function(data) {

                });
            });
        }
    }

    vo.oAudio = {
        bShowStartButton: false,
        bShowProgressBar: false,
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

    vo.Helper = {
        Init: function() {
            // Hide NextAssessment button
            $scope.$parent.vm.Helper.ShowHidePager(false);
            // Turn on practice mode
            $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Practice";
        },
        PlayNext: function(sType) {
            if (sType == "next") {
                vo.bShowStartButton = false;                
                cRandomCharacter = arrCharacters[nCurrentRound].Char;
                var nRecordLength = arrCharacters[nCurrentRound].RecordLength;
                vo.oAudio.nMaxTime = nRecordLength * 1000;                
                vo.oAudioRecorder.timeLimit = nRecordLength;

                nCurrentRound++;

                vo.oAudioRecorder.StartRecorderCountDown();

                if (bFirst) {
                    vo.sTextOnPlayButton = "Start";
                    bFirst = false;
                } else {
                    vo.sTextOnPlayButton = "Next";
                }
            }
        }
    }

    vo.oAudioRecorder = {
        recorded: null,
        timeLimit: 3, // make this 3
        autoStart: false,
        StartRecorderCountDown: function() {
            var nTimer = 3; // make this 3
            oAudioAssessment.displayedResponse = nTimer;
            var oIntervalPromise = $interval(function() {
                if (nTimer == 0) {
                    vo.oAudioRecorder.recorded = null;;
                    oAudioAssessment.displayedResponse = cRandomCharacter;
                    vo.oAudioRecorder.autoStart = true;                    
                    $timeout(function() {
                        vo.oAudio.StartProgressBar();
                    }, Constants.Assessments.ProgressStartDelay);
                    $interval.cancel(oIntervalPromise);
                } else {
                    oAudioAssessment.displayedResponse = --nTimer;
                }
            }, 1000, 4);
        },
        OnRecordStart: function() {
            console.log("RECORDING STARTED");
        },
        OnRecordAndConversionComplete: function() {
            $timeout(function() {
                vo.oService.AudioUpload(cRandomCharacter);

                if (nCurrentRound === nTotalRounds) {
                    $scope.$parent.vm.Helper.ShowHidePager(true, Constants.Miscellaneous.AssessmentCompleteNext);
                } else {
                    $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Final";
                    vo.bShowStartButton = true;
                }

                oAudioAssessment.displayedResponse = null;
                vo.oAudioRecorder.autoStart = false;
            }, 0);
        }
    }

    vo.Helper.Init();
}