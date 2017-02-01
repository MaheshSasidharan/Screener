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
            positionX: 'left',
            positionY: 'bottom'
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
