app.controller('SyncVoice', ['$scope', '$timeout', '$interval', 'Factory_Constants', 'Factory_CommonRoutines', 'Factory_DataService', SyncVoice]);

function SyncVoice($scope, $timeout, $interval, Constants, CommonFactory, DataService) {
    var sv = this;
    var bFirst = true;

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var source = context.createBufferSource(); // creates a sound source

    sv.sTextOnPlayButton = "Start Practice";
    sv.audioIndex = -1;
    sv.arrVoiceOPAndIP = [];
    sv.audioRecordLength = Constants.SyncVoiceAssessment.audioRecordLength;

    sv.oAudio = {
        bShowStartButton: false,
        bShowProgressBar: false,
        nMaxTime: sv.audioRecordLength * 1000,
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
                        //sv.oAudio.bShowStartButton = true;

                        if (sv.arrVoiceOPAndIP.length - 1 !== sv.audioIndex) {
                            sv.oAudio.bShowStartButton = true;
                            $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Final";
                        } else if (sv.arrVoiceOPAndIP.length - 1 == sv.audioIndex) {
                            sv.oAudio.bShowStartButton = false;
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

    sv.oAudioRecorder = {
        recorded: null,
        timeLimit: sv.audioRecordLength,
        autoStart: false,
        StartRecorderCountDown: function() {
            var nTimer = 3;
            sv.oAudio.displayedResponse = nTimer;
            $scope.$apply();
            var oIntervalPromise = $interval(function() {
                if (nTimer == 0) {
                //if (nTimer == 3) {
                    sv.oAudioRecorder.recorded = null;
                    sv.oAudio.displayedResponse = null;
                    sv.oAudio.StartProgressBar();
                    sv.oAudioRecorder.autoStart = true;
                    $interval.cancel(oIntervalPromise);
                } else {
                    sv.oAudio.displayedResponse = --nTimer;
                }
            }, 1000, 4);
        },
        OnRecordStart: function() {
            console.log("RECORDING STARTED");
        },
        OnRecordAndConversionComplete: function() {
            console.log("RECORDING Ended");
            $timeout(function() {
                //console.log(sv.oAudioRecorder.recorded);
                //sv.arrAudioToBeUploaded.push(sv.oAudioRecorder.recorded);
                sv.oAudioRecorder.autoStart = false;
                sv.arrVoiceOPAndIP[sv.audioIndex].oResponseVoice = sv.oAudioRecorder.recorded;
                sv.arrVoiceOPAndIP[sv.audioIndex].sStatus = 'responseAdded';
                sv.Helper.AudioSyncVoiceUpload();
            }, 0);
        }
    }

    sv.oService = {
        AudioSyncVoiceUpload: function(audioIndex) {
            var oResponse = sv.arrVoiceOPAndIP[audioIndex];
            CommonFactory.BlobToBase64(oResponse.oResponseVoice, function(base64) { // encode
                var oSaveItem = { 'blob': base64, 'sVoicePrefix': oResponse.sVoicePrefix };
                DataService.AudioSyncVoiceUpload(oSaveItem).then(function(data) {
                    if (data.status) {
                        sv.arrVoiceOPAndIP[audioIndex].sStatus = 'saved';
                    } else {
                        sv.arrVoiceOPAndIP[audioIndex].sStatus = 'failed';
                    }
                });
            });
        }
    }

    sv.Helper = {
        PlayNext: function(sType) {
            if (sType == "next") {
                if (sv.arrVoiceOPAndIP.length - 1 !== sv.audioIndex) {
                    ++sv.audioIndex;
                }
                if (bFirst) {
                    sv.sTextOnPlayButton = "Start";
                    bFirst = false;
                } else {
                // $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Final";
                    sv.sTextOnPlayButton = "Next";
                }
            } else { // prev
                if (sv.audioIndex !== 0) {
                    --sv.audioIndex;
                }
            }
            sv.Helper.PlaySound(sv.arrVoiceOPAndIP[sv.audioIndex].oVoice);
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
            sv.oAudio.bShowStartButton = false;
        },
        EndOfAudioPlay: function() {
            sv.oAudioRecorder.StartRecorderCountDown();
        },
        FinishedLoadingAudio(arrBuffers) {
            arrBuffers.forEach(function(oVoice, i) {
                sv.arrVoiceOPAndIP[i].oVoice = oVoice;
                sv.arrVoiceOPAndIP[i].sStatus = 'voiceAdded';
            });
            sv.oAudio.bShowStartButton = true;
            $scope.$apply();
        },
        AudioSyncVoiceUpload: function() {
            var audioIndex = sv.audioIndex;
            sv.oService.AudioSyncVoiceUpload(audioIndex);
        },
        Init: function() {
            // Hide NextAssessment button
            $scope.$parent.vm.Helper.ShowHidePager(false);
            // Turn on practice mode
            $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Practice";

            Constants.SyncVoiceAssessment.arrVoices.forEach(function(sVoicePrefix) {
                var oVoiceOPAndIP = {
                    sVoicePrefix: sVoicePrefix,
                    oVoice: null,
                    oResponseVoice: null,
                    sStatus: 'created'
                }
                sv.arrVoiceOPAndIP.push(oVoiceOPAndIP);
            });
            var bufferLoader = new BufferLoader(
                context, Constants.SyncVoiceAssessment.arrVoices,
                this.FinishedLoadingAudio,
                DataService.GetSyncVoiceAssessment
            );
            bufferLoader.load();
        },
    }
    sv.Helper.Init();
}
