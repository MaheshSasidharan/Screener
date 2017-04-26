app.controller('Metronome', ['$scope', '$timeout', '$interval', 'Factory_Constants', 'Factory_CommonRoutines', 'Factory_DataService', Metronome]);

function Metronome($scope, $timeout, $interval, Constants, CommonFactory, DataService) {
    var me = this;
    var bFirst = true;
    var firstTime = true;
    var nCurrentRound = 0;
    var arrResponse = [];
    var context = DataService.CreateOrGetContext();
    var source = context.createBufferSource(); // creates a sound source

    me.sTextOnPlayButton = "Start Practice";
    me.audioIndex = -1;
    me.arrClickOP = [];

    var playing = false;

    var nMetronomeClickCounter = Constants.MetronomeAssessment.totalClicks;
    var nTotalRounds = Constants.MetronomeAssessment.arrVoices.length;

    me.oMetronome = {
        arrTimeIntervalsStartStop: [],
        counter: nMetronomeClickCounter,
        start: null,
        end: null,
        intervalBetweenStarts: null
    }

    me.oAudio = {
        bShowStartButton: false,
        bShowResponseBox: false,
        bShowProgressBar: false,
        nRefreshRate: 500,
        sType: null,
        displayedResponse: null,
        StartRecorderCountDown: function() {
            var nTimer = 3;
            me.displayedResponse = nTimer;
            var oIntervalPromise = $interval(function() {
                if (nTimer == 0) {
                    //if (nTimer == 3) {
                    //me.Helper.PlayPause();
                    me.displayedResponse = null;
                    $interval.cancel(oIntervalPromise);
                    // playing = !playing;
                    // me.Helper.PlayPause();
                    //$timeout(function() {
                    // playing = !playing;
                    me.oAudio.bShowResponseBox = true;
                    me.oMetronome.initializedTime = new Date();
                    //}, 5000);
                } else {
                    me.displayedResponse = --nTimer;
                }
            }, 1000, 4);
        },
        StartProgressBarNew: function() {
            this.bShowStartButton = true;
        }
    }

    me.Helper = {
        PlayNext: function(sType) {
            if (sType == "next") {
                if (me.arrClickOP.length - 1 !== me.audioIndex) {
                    ++me.audioIndex;
                }
                if (bFirst) {
                    me.sTextOnPlayButton = "Start";
                    bFirst = false;
                } else {
                    // $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Final";
                    me.sTextOnPlayButton = "Next";
                }
            } else { // prev
                if (me.audioIndex !== 0) {
                    --me.audioIndex;
                }
            }
            me.Helper.PlaySound(me.arrClickOP[me.audioIndex].oVoice);
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
            me.oAudio.bShowStartButton = false;
        },
        EndOfAudioPlay: function() {
            $timeout(function() {
                me.oAudio.StartRecorderCountDown();
            }, 0);
        },
        FinishedLoadingAudio(arrBuffers) {
            arrBuffers.forEach(function(oVoice, i) {
                me.arrClickOP[i].oVoice = oVoice;
                me.arrClickOP[i].sStatus = 'voiceAdded';
            });
            $scope.$apply();
        },
        Init: function() {
            // Hide NextAssessment button
            $scope.$parent.vm.Helper.ShowHidePager(false);
            // Turn on practice mode
            $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Practice";
            // Reset response
            $scope.$parent.vm.currentAssessment.arrQuestions[0].response = null;

            Constants.MetronomeAssessment.arrVoices.forEach(function(sVoicePrefix) {
                var oVoiceOPAndIP = {
                    sVoicePrefix: sVoicePrefix,
                    oVoice: null,
                    sStatus: 'created'
                }
                me.arrClickOP.push(oVoiceOPAndIP);
            });
            var bufferLoader = new BufferLoader(
                context, Constants.MetronomeAssessment.arrVoices,
                this.FinishedLoadingAudio,
                DataService.GetMetronomeClickAssessment
            );
            bufferLoader.load();

            $scope.$parent.vm.EndOfAudioPlayCallback = this.AfterInstructionPlayed;
        },
        AfterInstructionPlayed: function() {
            me.oAudio.bShowStartButton = true;
        },
        // PlayPause: function() {
        //     if (firstTime) {
        //         me.Play();
        //         firstTime = false;
        //     }
        // },
        // PlayNext: function(sType) {
        //     if (sType == "next") {
        //         me.oAudio.bShowStartButton = false;
        //         me.oAudio.StartRecorderCountDown();
        //         if (bFirst) {
        //             me.sTextOnPlayButton = "Start";
        //             bFirst = false;
        //         } else {
        //             $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Final";
        //             me.sTextOnPlayButton = "Next";
        //         }

        //     }
        // },
        RecordTimeDuration: function(sType) {
            switch (sType) {
                case 'start':
                    if (me.oMetronome.start === null) {
                        me.oMetronome.intervalBetweenStarts = 0;
                        me.oMetronome.start = new Date();
                    } else {
                        me.oMetronome.intervalBetweenStarts = new Date() - me.oMetronome.start;
                        me.oMetronome.start = new Date();
                    }
                    break;
                case 'stop':
                    me.oMetronome.end = new Date();
                    var oIntervals = {
                        start: me.oMetronome.start,
                        end: me.oMetronome.end,
                        intervalBetweenStartEnd: me.oMetronome.end - me.oMetronome.start,
                        intervalBetweenStarts: me.oMetronome.intervalBetweenStarts,
                    }
                    me.oMetronome.arrTimeIntervalsStartStop.push(oIntervals);

                    if (--me.oMetronome.counter === 0) {
                        var oResponse = {
                            initializedTime: me.oMetronome.initializedTime,
                            arrTimeIntervalsStartStop: me.oMetronome.arrTimeIntervalsStartStop,
                            nCurrentRound: ++nCurrentRound
                        }

                        arrResponse.push(oResponse);

                        if (nCurrentRound === nTotalRounds) {
                            me.oAudio.bShowResponseBox = false;
                            $scope.$parent.vm.currentAssessment.arrQuestions[0].response = JSON.stringify(arrResponse);
                            $scope.$parent.vm.Helper.ShowHidePager(true, Constants.Miscellaneous.AssessmentCompleteNext);
                            playing = false;
                        } else {
                            me.oMetronome.start = null;
                            me.oAudio.bShowStartButton = true;
                            me.oAudio.bShowResponseBox = false;
                            me.oMetronome.counter = nMetronomeClickCounter;
                            me.oMetronome.arrTimeIntervalsStartStop = [];
                            $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Final";
                            playing = false;
                        }
                    }
                    break;
            }
        }
    }
    me.Helper.Init();
}
