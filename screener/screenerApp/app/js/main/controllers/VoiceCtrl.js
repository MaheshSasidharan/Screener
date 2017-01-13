app.controller('VoiceController', ['$scope', '$timeout', '$interval', '$sce', 'Factory_Constants', 'Factory_CommonRoutines', 'Factory_DataService', VoiceController]);

function VoiceController($scope, $timeout, $interval, $sce, Constants, CommonFactory, DataService, Upload) {
    var vo = this;
    var bFirst = true;
    vo.bShowStartButton = true;
    vo.sTextOnPlayButton = "Start Practice";
    var cRandomCharacter = null;
    var nCurrentRound = 0;
    var nTotalRounds = 2;

    vo.SoundBuffer = null;
    var oIntervalPromise = null;
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var source = context.createBufferSource(); // creates a sound source
    var oAudioAssessment = $scope.$parent.vm.assessments[7].arrQuestions[0];

    vo.TestAudio = null;
    vo.arrBuffers = null;
    vo.audioIndex = -1;

    vo.oService = {
        AudioUpload: function(sRandomCharacter) {
            CommonFactory.BlobToBase64(vo.oAudio.recorded, function(base64) { // encode
                var oSaveItem = { 'blob': base64, 'character': sRandomCharacter };
                DataService.AudioUpload(oSaveItem).then(function(data) {

                });
            });
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
                // if (nCurrentRound === nTotalRounds) {
                //     $scope.$parent.vm.Helper.ShowHidePager(true, Constants.Miscellaneous.AssessmentCompleteNext);
                // } else {
                nCurrentRound++;
                cRandomCharacter = CommonFactory.GetRandomCharacter();
                vo.oAudio.StartRecorderCountDown();
                //}
                if (bFirst) {
                    vo.sTextOnPlayButton = "Start";
                    bFirst = false;
                } else {
                    //$scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Final";
                    vo.sTextOnPlayButton = "Next";
                }
            }
        }
    }

    vo.oAudio = {
        recorded: null,
        timeLimit: 3, // make this 3
        autoStart: false,
        StartRecorderCountDown: function() {
            var nTimer = 3; // make this 3
            oAudioAssessment.displayedResponse = nTimer;
            oIntervalPromise = $interval(function() {
                if (nTimer == 0) {
                    oAudioAssessment.displayedResponse = cRandomCharacter;
                    vo.oAudio.autoStart = true;
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
                
                vo.oAudio.autoStart = false;
                oAudioAssessment.displayedResponse = "---";
            }, 0);
        }
    }

    vo.Helper.Init();
}
