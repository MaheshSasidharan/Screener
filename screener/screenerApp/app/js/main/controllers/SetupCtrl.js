app.controller('SetupCtrl', ['$state', 'Factory_CommonRoutines', 'Factory_DataService', SetupCtrl]);

function SetupCtrl($state, CommonFactory, DataService) {
    var se = this;

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
            console.log("RECORDING Ended");
        }
    }

    se.oSpeaker = {
        bShowSpeaker: false
    }

    se.Helper = {
        Init: function() {
            se.bFirstButtonShow = true;
            se.sFirstButtonText = "Let's get started";
        },
        FirstButton: function() {
            se.bFacingIssuesShow = false;
            CommonFactory.Notification.clearAll();
            se.bFirstButtonShow = false;
            if (!se.oStatus.bAudioTested) {
                se.bSecondButtonShow = true;
                se.sSecondButtonText = "Click to check your microphone.";
                se.sButtonIcon = "settings_voice";
                return;
            }
            if (!se.oStatus.bSpeakerTested) {
                se.bSecondButtonShow = true;
                se.sSecondButtonText = "Click to check your speakers.";
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
                se.oSpeaker.bShowSpeaker = true;
                return;
            }
        },
        OKNOTOK: function(sType) {
            if (!se.oStatus.bAudioTested) {
                if (sType === 'ok') {
                    se.oStatus.bAudioTested = true;                    
                    se.sFirstButtonText = "Great. Now let's check your speakers.";
                    DataService.oSetUpIssues.bHasMicrophoneIssue = false;
                } else {
                    se.bFacingIssuesShow = true;
                    se.sFirstButtonText = "Microphone not working. Try again by clicking here.";
                    DataService.oSetUpIssues.bHasMicrophoneIssue = true;
                    CommonFactory.Notification.error({ message: "Your microphone is not working. :(", delay: null });
                    //CommonFactory.Notification.error({ message: Constants.Miscellaneous.FailedMediaAccess, delay: null });
                }
                se.oAudioRecorder.autoStart = false;
                se.oAudioRecorder.bShowAudioRecorder = false;

            } else if (!se.oStatus.bSpeakerTested) {
                if (sType === 'ok') {
                    se.oStatus.bSpeakerTested = true;                    
                    se.sFirstButtonText = "Great. You are ready to start the assessment.";
                    DataService.oSetUpIssues.bHasSpeakerIssue = false;
                } else {
                    se.bFacingIssuesShow = true;
                    se.sFirstButtonText = "Speaker not working. Try again by clicking here.";
                    DataService.oSetUpIssues.bHasSpeakerIssue = true;
                    CommonFactory.Notification.error({ message: "Your speaker is not working. :(", delay: null });
                }
                se.oSpeaker.bShowSpeaker = false;
            }
            se.bOKNotOKShow = false;
            se.bSecondButtonShow = false;
            se.bFirstButtonShow = true;
        },
        Transition: function(){
            $state.transitionTo('screener.assessments');
        }
    }

    se.Helper.Init();
}