app.controller('TimeDuration', ['$scope', '$timeout', '$interval', 'Factory_Constants', 'Factory_CommonRoutines', 'Factory_DataService', TimeDuration]);

function TimeDuration($scope, $timeout, $interval, Constants, CommonFactory, DataService) {
    $scope.$parent.vm.Helper.ShowHidePager(false);
    $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Practice";

    var td = this;
    var timeDuration = 0.5; //Constants.AudioAssessment.audioRecordLength;

    var circle = new ProgressBar.Circle('#assess_circle', {
        color: '#000',
        duration: timeDuration * 1000,
        easing: 'linear'
    });

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
        Next: function() {
            td.oAudio.StartCircularProgressBarNew();
        },
        RecordTimeDuration: function(sType) {
            switch (sType) {
                case 'start':
                    td.oAudio.nResponseBoxValue = new Date();
                    break;
                case 'stop':
                    td.oAudio.bShowResponseBox = false;
                    td.oAudio.nResponseBoxValue = new Date() - td.oAudio.nResponseBoxValue;
                    //console.log(td.oAudio.nResponseBoxValue);
                    $scope.$parent.vm.currentAssessment.arrQuestions[0].response = td.oAudio.nResponseBoxValue;
                    $scope.$parent.vm.Helper.ShowHidePager(true, Constants.Miscellaneous.AssessmentCompleteNext);
                    break;
            }
        }
    }
}
