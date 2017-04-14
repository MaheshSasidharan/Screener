app.controller('WordFindingController', ['$scope', '$timeout', '$interval', '$sce', 'Factory_Constants', 'Factory_CommonRoutines', 'Factory_DataService', WordFindingController]);

function WordFindingController($scope, $timeout, $interval, $sce, Constants, CommonFactory, DataService, Upload) {
    var wo = this;
    var bFirst = true;
    wo.bShowStartButton = true;
    wo.sTextOnPlayButton = "Start Practice";
    var cRandomCharacter = null;
    var arrCharacters = Constants.VoiceAssessment.arrCharacters;
    var nCurrentRound = 0;
    var nTotalRounds = arrCharacters.length;

    wo.SoundBuffer = null;
    var oIntervalPromise = null;
    // window.AudioContext = window.AudioContext || window.webkitAudioContext;
    // var context = new AudioContext();
    var context = DataService.CreateOrGetContext();
    var source = context.createBufferSource(); // creates a sound source
    //var oAudioAssessment = $scope.$parent.vm.assessments[7].arrQuestions[0];    

    wo.TestAudio = null;
    wo.arrBuffers = null;

    var audioIndex = -1;

    wo.oService = {
        AudioUpload: function(sRandomCharacter) {
            CommonFactory.BlobToBase64(wo.oAudioRecorder.recorded, function(base64) { // encode
                var oSaveItem = { 'blob': base64, 'character': sRandomCharacter };
                DataService.AudioUpload(oSaveItem).then(function(data) {

                });
            });
        }
    }

    wo.oAudio = {
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

    wo.Helper = {
        Init: function() {
            // Hide NextAssessment button
            $scope.$parent.vm.Helper.ShowHidePager(false);
            // Turn on practice mode
            $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Practice";
        },
        PlayNext: function(sType) {
            if (sType == "next") {
                wo.bShowStartButton = false;
                var arrChars = arrCharacters[nCurrentRound].arrChars;
                cRandomCharacter = arrChars[Math.floor(Math.random() * arrChars.length)];
                var nRecordLength = arrCharacters[nCurrentRound].RecordLength;
                wo.oAudio.nMaxTime = nRecordLength * 1000;                
                wo.oAudioRecorder.timeLimit = nRecordLength;

                nCurrentRound++;

                wo.oAudioRecorder.StartRecorderCountDown();

                if (bFirst) {
                    wo.sTextOnPlayButton = "Start";
                    bFirst = false;
                } else {
                    wo.sTextOnPlayButton = "Next";
                }
            }
        }
    }

    wo.oAudioRecorder = {
        recorded: null,
        timeLimit: 3, // make this 3
        autoStart: false,
        StartRecorderCountDown: function() {
            var nTimer = 3; // make this 3
            wo.oAudio.displayedResponse = nTimer;
            var oIntervalPromise = $interval(function() {
                if (nTimer == 0) {
                    wo.oAudioRecorder.recorded = null;;
                    wo.oAudio.displayedResponse = cRandomCharacter;
                    wo.oAudioRecorder.autoStart = true;                    
                    $timeout(function() {
                        wo.oAudio.StartProgressBar();
                    }, Constants.Assessments.ProgressStartDelay);
                    $interval.cancel(oIntervalPromise);
                } else {
                    wo.oAudio.displayedResponse = --nTimer;
                }
            }, 1000, 4);
        },
        OnRecordStart: function() {
            //console.log("RECORDING STARTED");
        },
        OnRecordAndConversionComplete: function() {
            $timeout(function() {
                wo.oService.AudioUpload(cRandomCharacter);

                if (nCurrentRound === nTotalRounds) {
                    $scope.$parent.vm.Helper.ShowHidePager(true, Constants.Miscellaneous.AssessmentCompleteNext);
                } else {
                    $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Final";
                    wo.bShowStartButton = true;
                }

                wo.oAudio.displayedResponse = null;
                wo.oAudioRecorder.autoStart = false;
            }, 0);
        }
    }

    wo.Helper.Init();
}