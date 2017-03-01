// var app = angular.module('app', ['ui.router', 'webcam', 'ui.bootstrap', 'angularAudioRecorder', 'ui-notification', 'Orbicular']);
var app = angular.module('app', ['ngAnimate', 'ui.router', 'webcam', 'ui.bootstrap', 'angularAudioRecorder', 'ui-notification', 'Orbicular', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache']);


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

.config(function($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function(date) {
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return day + '/' + (monthIndex + 1) + '/' + year;

    };
})

.config(['$mdAriaProvider', function($mdAriaProvider) {
    $mdAriaProvider.disableWarnings();
}])

.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('teal');
})

.config(['recorderServiceProvider', function(recorderServiceProvider) {
    recorderServiceProvider.withResampling(16000);
}]);


var history_api = typeof history.pushState !== 'undefined';
// history.pushState must be called out side of AngularJS Code
if (history_api) history.pushState(null, '', '#StayHere');
