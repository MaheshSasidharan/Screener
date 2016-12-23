app.controller('TimeDuration', ['$scope', '$timeout', '$interval', 'Factory_Constants', 'Factory_CommonRoutines', 'Factory_DataService', TimeDuration]);

function TimeDuration($scope, $timeout, $interval, Constants, CommonFactory, DataService) {
    $scope.$parent.vm.Helper.ShowHidePager(false);
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
        // StartProgressBar: function() {
        //     this.bShowProgressBar = true;
        //     this.sType = null;
        //     var that = this;
        //     oIntervalPromise = $interval(function() {
        //         if (that.nSpentTime + that.nRefreshRate == that.nMaxTime) {
        //             $interval.cancel(oIntervalPromise);
        //             that.nSpentTime += that.nRefreshRate;
        //             $timeout(function() {
        //                 that.nSpentTime = 0;
        //                 that.bShowProgressBar = false;
        //             }, 1000);
        //         } else {
        //             that.nSpentTime += that.nRefreshRate;
        //         }
        //     }, this.nRefreshRate, this.nMaxTime / this.nRefreshRate);
        // },
        // StartProgressBarNew: function() {
        //     this.bShowStartButton = false;
        //     this.bShowProgressBar = true;
        //     this.nSpentTime = 0;
        //     var that = this;
        //     angular.element(document.querySelector('.SC_TimeDuration .progress-bar'))
        //         .css({
        //             '-webkit-transition-duration': td.oAudio.nMaxTime + 'ms',
        //             '-moz-transition-duration': td.oAudio.nMaxTime + 'ms',
        //             '-ms-transition-duration': td.oAudio.nMaxTime + 'ms',
        //             '-o-transition-duration': td.oAudio.nMaxTime + 'ms',
        //             'transition-duration': td.oAudio.nMaxTime + 'ms'
        //         });
        //     $timeout(function() {
        //         that.nSpentTime = that.nMaxTime;
        //         $timeout(function() {
        //             that.nSpentTime = 0;
        //             that.bShowProgressBar = false;
        //             that.bShowResponseBox = true;
        //         }, that.nMaxTime);
        //     }, 0);
        // },
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
            /*

            $timeout(function() {
                that.nSpentTime = that.nMaxTime;

                
                // angular.element(document.querySelectorAll('div.co-circle-progress > div.co-circle, div.co-circle-progress div.co-fill'))
                // .css({
                //     '-webkit-transition-duration': td.oAudio.nMaxTime + 'ms',
                //     '-moz-transition-duration': td.oAudio.nMaxTime + 'ms',
                //     '-ms-transition-duration': td.oAudio.nMaxTime + 'ms',
                //     '-o-transition-duration': td.oAudio.nMaxTime + 'ms',
                //     'transition-duration': td.oAudio.nMaxTime + 'ms'
                // });
                

                /*
                angular.element(document.querySelector('div.co-circle-progress > div.co-circle'))
                .css({
                    '-webkit-transition-duration': td.oAudio.nMaxTime + 'ms',
                    '-moz-transition-duration': td.oAudio.nMaxTime + 'ms',
                    '-ms-transition-duration': td.oAudio.nMaxTime + 'ms',
                    '-o-transition-duration': td.oAudio.nMaxTime + 'ms',
                    'transition-duration': td.oAudio.nMaxTime + 'ms'
                });
                */
            /*
                angular.element(document.querySelectorAll('div.co-circle-progress > div.co-circle, div.co-circle-progress div.co-fill'))
                .css({
                    '-webkit-transition': 'transform ' + td.oAudio.nMaxTime + 'ms linear',
                    '-moz-transition': 'transform ' + td.oAudio.nMaxTime + 'ms linear',
                    '-ms-transition': 'transform ' + td.oAudio.nMaxTime + 'ms linear',
                    '-o-transition': 'transform ' + td.oAudio.nMaxTime + 'ms linear',
                    'transition': 'transform ' + td.oAudio.nMaxTime + 'ms linear'
                });
                

                $timeout(function() {
                    that.nSpentTime = 0;
                    that.bShowProgressBar = false;
                    that.bShowResponseBox = true;
                }, that.nMaxTime);
            }, 0);
            */
        }
    }

    td.Helper = {
        Next: function() {
            //td.oAudio.StartProgressBarNew();
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
                    console.log(td.oAudio.nResponseBoxValue);
                    $scope.$parent.vm.currentAssessment.arrQuestions[0].response = td.oAudio.nResponseBoxValue;
                    $scope.$parent.vm.Helper.ShowHidePager(true, Constants.Miscellaneous.AssessmentCompleteNext);
                    break;
            }
        }
    }
}
