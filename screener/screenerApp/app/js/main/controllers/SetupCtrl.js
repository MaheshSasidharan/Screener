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
        bSpeakerTested: false,
        bCameraTested: false
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

    se.oVideo = {
        bShowVideo: false,
        CaptureUserMedia: function(success_callback) {
            var session = {
                audio: true,
                video: true
            };

            navigator.getUserMedia(session, success_callback, function(error) {
                alert('Unable to capture your camera. Please check console logs.');
                console.error(error);
            });
        },
        StartRecording: function() {
            var video = document.querySelector('video');
            this.CaptureUserMedia(function(stream) {
                mediaStream = stream;

                video.src = window.URL.createObjectURL(stream);
                video.play();
                video.muted = false;
                video.controls = false;

                recorder = RecordRTC(stream, {
                    type: 'video'
                });

                recorder.startRecording();
            });
        },
        StopRecording: function() {
            recorder.stopRecording();
            se.oVideo.bShowVideo = false;
        }
    }

    se.Helper = {
        GetUserMedia: function() {
            if (this.HasGetUserMedia()) {
                // Check if phone is being used
                DataService.isMobileDevice = navigator.userAgent.match(/iPad|iPhone|iPod|android/i) != null || screen.width <= 480;

                if (DataService.isMobileDevice || DataService.oSetUpIssues.bHasSetupIssue()) {
                    se.Helper.Init();
                    return;
                }
                navigator.webkitGetUserMedia({ audio: true, video: true }, function() {
                    se.Helper.Init();
                }, function() {
                    CommonFactory.Notification.error({ message: Constants.Miscellaneous.FailedMediaAccess, delay: null });
                });
            } else {
                CommonFactory.Notification.error({ message: Constants.Miscellaneous.NoBrowserSupport, delay: null });
            }
        },
        HasGetUserMedia: function() {
            return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia || navigator.msGetUserMedia);
        },
        Init: function() {
            //this.InitAudioContext();
            //context = DataService.oAudioContext;
            context = DataService.CreateOrGetContext();
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
            if (!se.oStatus.bCameraTested) {
                se.bSecondButtonShow = true;
                se.sSecondButtonText = Constants.Setup.ButtonStatus.CheckCamera;
                se.sButtonIcon = "settings_voice";
                return;
            }
            // If all have been tested
            DataService.oSetUpIssues.bHasMicrophoneIssue = false;
            DataService.oSetUpIssues.bHasSpeakerIssue = false;
            DataService.oSetUpIssues.bHasCameraIssue = false;            
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
            if (!se.oStatus.bCameraTested) {                
                se.oVideo.bShowVideo = true;                
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
                    se.sFirstButtonText = Constants.Setup.ButtonStatus.CheckCameraFirst;
                    DataService.oSetUpIssues.bHasSpeakerIssue = false;
                } else {
                    se.bFacingIssuesShow = true;
                    se.sFirstButtonText = Constants.Setup.ButtonStatus.NotWorkingSpeaker;
                    DataService.oSetUpIssues.bHasSpeakerIssue = true;
                    CommonFactory.Notification.error({ message: Constants.Setup.ButtonStatus.NotWorkingSpeakerNotification, delay: null });
                }
                se.oSpeaker.bShowSpeaker = false;
            }  else if (!se.oStatus.bCameraTested) {
                se.oVideo.StopRecording() // Stop camera
                if (sType === 'ok') {
                    se.oStatus.bCameraTested = true;
                    se.sFirstButtonText = Constants.Setup.ButtonStatus.StartAssessment;
                    DataService.oSetUpIssues.bHasCameraIssue = false;
                } else {
                    se.bFacingIssuesShow = true;
                    se.sFirstButtonText = Constants.Setup.ButtonStatus.NotWorkingCamera;
                    DataService.oSetUpIssues.bHasCameraIssue = true;
                    CommonFactory.Notification.error({ message: Constants.Setup.ButtonStatus.NotWorkingCameraNotification, delay: null });
                }
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