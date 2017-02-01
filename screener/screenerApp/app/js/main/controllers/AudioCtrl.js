app.controller('AudioController', ['$scope', '$timeout', '$interval', '$sce', 'Factory_Constants', 'Factory_CommonRoutines', 'Factory_DataService', AudioController]);

function AudioController($scope, $timeout, $interval, $sce, Constants, CommonFactory, DataService, Upload) {
    var au = this;
    var bFirst = true;

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var source = context.createBufferSource(); // creates a sound source

    au.sTextOnPlayButton = "Start Practice";

    au.audioIndex = -1;
    au.arrVoiceOPAndIP = [];

    au.oAudio = {
        bShowStartButton: true,
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
            oIntervalPromise = $interval(function() {
                if (that.nSpentTime + that.nRefreshRate == that.nMaxTime) {
                    $interval.cancel(oIntervalPromise);
                    // Let progress reach 100% on UI. So increase by nSpentTime by one more step and reset to zero after one second
                    that.nSpentTime += that.nRefreshRate;
                    $timeout(function() {
                        // Give a gap of 1 second
                        that.nSpentTime = 0;
                        that.bShowProgressBar = false;
                        //au.oAudio.bShowStartButton = true;
                        if (au.arrVoiceOPAndIP.length - 1 !== au.audioIndex) {
                            au.oAudio.bShowStartButton = true;
                            $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Final";
                            //au.sTextOnPlayButton = "Next audio";
                        } else if (au.arrVoiceOPAndIP.length - 1 == au.audioIndex) {
                            au.oAudio.bShowStartButton = false;
                            $scope.$parent.vm.Helper.ShowHidePager(true, Constants.Miscellaneous.AssessmentCompleteNext);
                        }
                    }, 1000);
                } else {
                    //that.sType = CommonFactory.GetProgressType(that.nSpentTime, that.nMaxTime);
                    that.nSpentTime += that.nRefreshRate;
                }
            }, this.nRefreshRate, this.nMaxTime / this.nRefreshRate);
        }
    }

    au.oAudioRecorder = {
        recorded: null,
        timeLimit: null,
        autoStart: false,
        StartRecorderCountDown: function() {
            var nTimer = 3;
            au.oAudio.displayedResponse = nTimer;
            $scope.$apply();
            var oIntervalPromise = $interval(function() {
                if (nTimer == 0) {
                    au.oAudioRecorder.recorded = null;
                    au.oAudio.displayedResponse = null;
                    au.oAudio.StartProgressBar();
                    au.oAudioRecorder.autoStart = true;
                    $interval.cancel(oIntervalPromise);
                } else {
                    au.oAudio.displayedResponse = --nTimer;
                }
            }, 1000, 4);
        },
        OnRecordStart: function() {
            console.log("RECORDING STARTED");
        },
        OnRecordAndConversionComplete: function() {
            console.log("RECORDING Ended");
            $timeout(function() {
                //console.log(au.oAudioRecorder.recorded);
                //au.arrAudioToBeUploaded.push(au.oAudioRecorder.recorded);
                au.oAudioRecorder.autoStart = false;
                au.arrVoiceOPAndIP[au.audioIndex].oResponseVoice = au.oAudioRecorder.recorded;
                au.arrVoiceOPAndIP[au.audioIndex].sStatus = 'responseAdded';
                au.Helper.AudioUploadWord();
            }, 0);
        }
    }

    au.oService = {
        AudioUploadWord: function(audioIndex) {
            var oResponse = au.arrVoiceOPAndIP[audioIndex];
            CommonFactory.BlobToBase64(oResponse.oResponseVoice, function(base64) { // encode
                var oSaveItem = { 'blob': base64, 'sVoicePrefix': oResponse.sVoicePrefix };
                DataService.AudioUploadWord(oSaveItem).then(function(data) {
                    if (data.status) {
                        au.arrVoiceOPAndIP[audioIndex].sStatus = 'saved';
                    } else {
                        au.arrVoiceOPAndIP[audioIndex].sStatus = 'failed';
                    }
                });
            });
        }
    }

    au.Helper = {
        PlayNext: function(sType) {
            if (sType == "next") {
                if (au.arrVoiceOPAndIP.length - 1 !== au.audioIndex) {
                    ++au.audioIndex;
                    if (bFirst) {
                        au.sTextOnPlayButton = "Start";
                        bFirst = false;
                    } else {
                        // $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Final";
                        au.sTextOnPlayButton = "Next Audio";
                    }
                }
            } else { // prev
                if (au.audioIndex !== 0) {
                    --au.audioIndex;
                }
            }

            var nRecordLength = au.arrVoiceOPAndIP[au.audioIndex].nRecordLength;
            au.oAudio.nMaxTime = nRecordLength * 1000;
            au.oAudioRecorder.timeLimit = nRecordLength;

            au.Helper.PlaySound(au.arrVoiceOPAndIP[au.audioIndex].oVoice);
        },
        PlaySound: function(buffer) {
            if (source.buffer) {
                source.disconnect();
                source = context.createBufferSource();
            }
            source.onended = this.EndOfAudioPlay;
            source.buffer = buffer; // tell the source which sound to play
            source.connect(context.destination); // connect the source to the context's destination (the speakers)
            source.start(0); // play the source now
            au.oAudio.bShowStartButton = false;
        },
        EndOfAudioPlay: function() {
            au.oAudioRecorder.StartRecorderCountDown();
        },
        FinishedLoadingAudio(arrBuffers) {
            arrBuffers.forEach(function(oVoice, i) {
                au.arrVoiceOPAndIP[i].oVoice = oVoice;
                au.arrVoiceOPAndIP[i].sStatus = 'voiceAdded';
            });
            au.oAudio.bShowStartButton = true;
            $scope.$apply();
        },
        AudioUploadWord: function() {
            var audioIndex = au.audioIndex;
            au.oService.AudioUploadWord(audioIndex);
        },
        Init: function() {
            // Hide NextAssessment button
            $scope.$parent.vm.Helper.ShowHidePager(false);
            // Turn on practice mode
            $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Practice";
            var arrVoices = [];
            Constants.AudioAssessment.arrVoices.forEach(function(sVoicePrefix) {
                var oVoiceOPAndIP = {
                    sVoicePrefix: sVoicePrefix.Prefix,
                    nRecordLength: sVoicePrefix.RecordLength,
                    oVoice: null,
                    oResponseVoice: null,
                    sStatus: 'created'
                }
                arrVoices.push(sVoicePrefix.Prefix);
                au.arrVoiceOPAndIP.push(oVoiceOPAndIP);
            });
            var bufferLoader = new BufferLoader(
                context, arrVoices,
                this.FinishedLoadingAudio,
                DataService.GetAudioAssessment
            );
            bufferLoader.load();
        },
    }
    au.Helper.Init();
}
