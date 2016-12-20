app.controller('VoiceController', ['$scope', '$timeout', '$interval', '$sce', 'Factory_Constants', 'Factory_CommonRoutines', 'Factory_DataService', VoiceController]);

function VoiceController($scope, $timeout, $interval, $sce, Constants, CommonFactory, DataService, Upload) {
    var vo = this;
    vo.SoundBuffer = null;
    $scope.$parent.vm.Helper.ShowHidePager(false);
    var oIntervalPromise = null;
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var source = context.createBufferSource(); // creates a sound source
    var oAudioAssessment = $scope.$parent.vm.assessments[5].arrQuestions[0];

    vo.TestAudio = null;
    vo.arrBuffers = null;
    vo.audioIndex = -1;
    vo.test1 = function() {
        var reader = new FileReader();
        reader.onload = function() {
            vo.TestAudio = $sce.trustAsResourceUrl(reader.result);
            var x = reader.result.split(',')[1];
            $scope.$apply();
        };
        reader.readAsDataURL(vo.oAudio.recorded);
    }

    vo.test3 = function(sType) {
        if (sType == "next") {
            if (vo.arrBuffers.length - 1 !== vo.audioIndex) {
                ++vo.audioIndex;
            }
        } else { // prev
            if (vo.audioIndex !== 0) {
                --vo.audioIndex;
            }
        }
        vo.Helper.PlaySound(vo.arrBuffers[vo.audioIndex]);
    }

    vo.oService = {
        AudioUpload: function() {
            CommonFactory.BlobToBase64(vo.oAudio.recorded, function(base64) { // encode
                var oSaveItem = { 'blob': base64, 'character': oAudioAssessment.response };
                DataService.AudioUpload(oSaveItem).then(function(data) {
                    $scope.$parent.vm.Helper.ShowHidePager(true, Constants.Miscellaneous.AssessmentCompleteNext);
                });
            });
        },
        GetAudioAssessment: function(audioName) {
            return DataService.GetAudioAssessment(audioName).then(function(data) {
                return data;
            });
        }
    }

    vo.Helper = {
        GetAudioAssessment: function(audioName) {
            vo.oService.GetAudioAssessment(audioName).then(function(data) {
                vo.test2(data);
                return;
            });
        },
        PlaySound: function(buffer) {
            if (source.buffer) {
                source.disconnect();
                source = context.createBufferSource();
            }
            source.buffer = buffer; // tell the source which sound to play
            source.connect(context.destination); // connect the source to the context's destination (the speakers)
            source.start(0); // play the source now
        },
    }

    vo.oAudio = {
        recorded: null,
        timeLimit: 3, // make this 3
        autoStart: false,
        StartRecorderCountDown: function() {
            $scope.$parent.vm.Helper.ShowHidePager(false);
            
            var nTimer = 3; // make this 3
            oAudioAssessment.displayedResponse = nTimer;
            oIntervalPromise = $interval(function() {
                if (nTimer == 0) {
                    oAudioAssessment.displayedResponse = oAudioAssessment.response;
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
            $timeout(vo.oService.AudioUpload, 0);
        }
    }
}
