// var app = angular.module('app', ['ui.router', 'webcam', 'ui.bootstrap', 'angularAudioRecorder', 'ui-notification', 'Orbicular']);
var app = angular.module('app', ['ngAnimate', 'ui.router', 'webcam', 'ui.bootstrap', 'angularAudioRecorder', 'ui-notification', 'Orbicular']);


app
    .config(function(NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 3000,
            startTop: 65,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'top'
        });
    })

.config([
    '$httpProvider',
    function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }
])

.config(['recorderServiceProvider', function(recorderServiceProvider) {
    //configure here
}]);


var history_api = typeof history.pushState !== 'undefined';
// history.pushState must be called out side of AngularJS Code
if ( history_api ) history.pushState(null, '', '#StayHere'); 