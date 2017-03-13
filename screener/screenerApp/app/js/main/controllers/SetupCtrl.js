app.controller('SetupCtrl', ['$scope', '$state', 'Factory_Constants', 'Factory_CommonRoutines', 'Factory_DataService', SetupCtrl]);

function SetupCtrl($scope, $state, Constants, CommonFactory, DataService) {
    var se = this;
    se.arrVoiceOPAndIP = [];
    var context = null;
    var source = null;

    se.bFirstButtonShow = false;
    se.sFirstButtonText = "";

    se.bSecondButtonShow = false;
    se.sSecondButtonText = "";

    se.bOKNotOKShow = false;
    se.sButtonIcon = null;

    se.bFacingIssuesShow = false;

    se.oStatus = {
        bAudioTested: false,
        bSpeakerTested: false
    }

    se.oAudioRecorder = {
        recorded: null,
        timeLimit: 10000,
        autoStart: false,
        bShowAudioRecorder: false,
        OnRecordStart: function() {
            //console.log("RECORDING STARTED");            
        },
        OnRecordAndConversionComplete: function() {
            //console.log("RECORDING Ended");
        }
    }

    se.oSpeaker = {
        bShowSpeaker: false
    }

    se.Helper = {
        Init: function() {
            this.InitAudioContext();
            context = DataService.oAudioContext;
            source = context.createBufferSource(); // creates a sound source
            se.bFirstButtonShow = true;
            se.sFirstButtonText = Constants.Setup.ButtonStatus.GetStarted;

            Constants.Setup.arrVoices.forEach(function(sVoicePrefix) {
                var oVoiceOPAndIP = {
                    sVoicePrefix: sVoicePrefix,
                    oVoice: null,
                    oResponseVoice: null,
                    sStatus: 'created'
                }
                se.arrVoiceOPAndIP.push(oVoiceOPAndIP);
            });
            var bufferLoader = new BufferLoader(
                context, Constants.Setup.arrVoices,
                this.FinishedLoadingAudio,
                DataService.GetSetupAudio
            );
            bufferLoader.load();
        },
        InitAudioContext: function() {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            DataService.oAudioContext = new AudioContext();
        },
        FinishedLoadingAudio(arrBuffers) {
            arrBuffers.forEach(function(oVoice, i) {
                se.arrVoiceOPAndIP[i].oVoice = oVoice;
                se.arrVoiceOPAndIP[i].sStatus = 'voiceAdded';
            });
            $scope.$apply();
        },
        PlayAudio: function() {
            se.Helper.PlaySound(se.arrVoiceOPAndIP[se.audioIndex].oVoice);
        },
        PlaySound: function(buffer) {
            if (source.buffer) {
                this.StopSound();
                source = context.createBufferSource();
            }
            source.onended = this.EndOfAudioPlay;
            source.buffer = buffer; // tell the source which sound to play
            source.connect(context.destination); // connect the source to the context's destination (the speakers)
            source.start(0); // play the source now            
        },
        StopSound: function() {
            if (source.buffer) {
                source.disconnect();
            }
        },
        FirstButton: function() {
            se.bFacingIssuesShow = false;
            CommonFactory.Notification.clearAll();
            se.bFirstButtonShow = false;
            if (!se.oStatus.bAudioTested) {
                se.bSecondButtonShow = true;
                se.sSecondButtonText = Constants.Setup.ButtonStatus.CheckMicrophone;
                se.sButtonIcon = "settings_voice";
                return;
            }
            if (!se.oStatus.bSpeakerTested) {
                se.bSecondButtonShow = true;
                se.sSecondButtonText = Constants.Setup.ButtonStatus.CheckSpeaker;
                se.sButtonIcon = "volume_down";
                return;
            }
            // If all have been tested
            DataService.oSetUpIssues.bHasMicrophoneIssue = false;
            DataService.oSetUpIssues.bHasSpeakerIssue = false;
            this.Transition();
        },
        SecondButton: function() {
            se.bOKNotOKShow = true;
            se.bSecondButtonShow = false;

            if (!se.oStatus.bAudioTested) {
                se.oAudioRecorder.autoStart = true;
                se.oAudioRecorder.bShowAudioRecorder = true;
                return;
            }
            if (!se.oStatus.bSpeakerTested) {
                se.audioIndex = 0;
                se.oSpeaker.bShowSpeaker = true;
                se.Helper.PlayAudio();
                return;
            }
        },
        OKNOTOK: function(sType) {
            if (!se.oStatus.bAudioTested) {
                if (sType === 'ok') {
                    se.oStatus.bAudioTested = true;
                    se.sFirstButtonText = Constants.Setup.ButtonStatus.CheckSpeakerFirst;
                    DataService.oSetUpIssues.bHasMicrophoneIssue = false;
                } else {
                    se.bFacingIssuesShow = true;
                    se.sFirstButtonText = Constants.Setup.ButtonStatus.NotWorkingMicrophone;
                    DataService.oSetUpIssues.bHasMicrophoneIssue = true;
                    CommonFactory.Notification.error({ message: Constants.Setup.ButtonStatus.NotWorkingMicrophoneNotification, delay: null });
                }
                se.oAudioRecorder.autoStart = false;
                se.oAudioRecorder.bShowAudioRecorder = false;

            } else if (!se.oStatus.bSpeakerTested) {
                this.StopSound(); // Stop sound if it is still playing
                if (sType === 'ok') {
                    se.oStatus.bSpeakerTested = true;
                    se.sFirstButtonText = Constants.Setup.ButtonStatus.StartAssessment;
                    DataService.oSetUpIssues.bHasSpeakerIssue = false;
                } else {
                    se.bFacingIssuesShow = true;
                    se.sFirstButtonText = Constants.Setup.ButtonStatus.NotWorkingSpeaker;
                    DataService.oSetUpIssues.bHasSpeakerIssue = true;
                    CommonFactory.Notification.error({ message: Constants.Setup.ButtonStatus.NotWorkingSpeakerNotification, delay: null });
                }
                se.oSpeaker.bShowSpeaker = false;
            }
            se.bOKNotOKShow = false;
            se.bSecondButtonShow = false;
            se.bFirstButtonShow = true;
        },
        Transition: function() {
            $state.transitionTo('screener.assessments');
        }
    }
    se.Helper.Init();
}