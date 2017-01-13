app.controller('TimeDuration', ['$scope', '$timeout', '$interval', 'Factory_Constants', 'Factory_CommonRoutines', 'Factory_DataService', TimeDuration]);

function TimeDuration($scope, $timeout, $interval, Constants, CommonFactory, DataService) {
    var td = this;
    var bFirst = true;
    var timeDuration = 0.5; //Constants.AudioAssessment.audioRecordLength;
    var nCurrentRound = 0;
    var nTotalRounds = 2;
    var arrResponse = [];

    td.sTextOnPlayButton = "Start Practice";
    var circle = null;

    td.oAudio = {
        bShowStartButton: true,
        bShowResponseBox: false,
        bShowProgressBar: false,
        nResponseBoxValue: null,
        nMaxTime: timeDuration * 1000,
        nRefreshRate: 500,
        sType: null,
        displayedResponse: null,
        StartCircularProgressBarNew: function() {
            this.bShowStartButton = false;
            this.bShowProgressBar = true;
            this.nSpentTime = 0;
            var that = this;
            circle.animate(1);
            $timeout(function() {
                that.nSpentTime = 0;
                //that.bShowProgressBar = false;
                that.bShowResponseBox = true;
            }, that.nMaxTime);
        }
    }

    td.Helper = {
        Init: function() {
            // Hide NextAssessment button
            $scope.$parent.vm.Helper.ShowHidePager(false);
            // Turn on practice mode
            $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Practice";
            // Reset response
            $scope.$parent.vm.currentAssessment.arrQuestions[0].response = null;
            // Init the circle
            circle = new ProgressBar.Circle('#assess_circle', {
                color: '#000',
                duration: timeDuration * 1000,
                easing: 'linear'
            });
        },
        PlayNext: function(sType) {
            if (sType == "next") {
                td.oAudio.StartCircularProgressBarNew();
                if (bFirst) {
                    td.sTextOnPlayButton = "Start";
                    bFirst = false;
                } else {
                    $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Final";
                    td.sTextOnPlayButton = "Next";
                }

            }
        },
        RecordTimeDuration: function(sType) {
            switch (sType) {
                case 'start':
                    td.oAudio.nResponseBoxValue = new Date();
                    break;
                case 'stop':
                    td.oAudio.bShowResponseBox = false;
                    td.oAudio.nResponseBoxValue = new Date() - td.oAudio.nResponseBoxValue;

                    var oSaveObject = {
                        sType: $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode,
                        response: td.oAudio.nResponseBoxValue,
                        nCurrentRound: ++nCurrentRound
                    }
                    arrResponse.push(oSaveObject);
                    if (nCurrentRound === nTotalRounds) {
                        $scope.$parent.vm.currentAssessment.arrQuestions[0].response = JSON.stringify(arrResponse);
                        $scope.$parent.vm.Helper.ShowHidePager(true, Constants.Miscellaneous.AssessmentCompleteNext);
                    } else {
                        td.oAudio.bShowProgressBar = false;
                        circle.set(0);
                        $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Final";
                        td.oAudio.bShowStartButton = true;
                    }
                    break;
            }
        }
    }
    td.Helper.Init();
}
