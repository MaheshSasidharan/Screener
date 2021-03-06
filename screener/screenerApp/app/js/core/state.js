// Application Level State
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

  $stateProvider
    .state('screener', {
      abstract: true,
      url: '',
      controller: 'AppCtrl',
      views: {
        'navbar': {
          templateUrl: 'js/core/templates/navbar.tpl.html',
          controller: 'NavbarCtrl'
        },
        'main': {
          templateUrl: 'js/core/templates/main.tpl.html'
        }
      }
    })
    .state('404', {
      url: '/404',
      templateUrl: 'js/core/templates/404.tpl.html',
      controller: 'AppCtrl'
    });

    $urlRouterProvider.when('/', '/screener');
    $locationProvider.hashPrefix('');
    //$urlRouterProvider.otherwise('/app');
    //$locationProvider.html5Mode(true);
}]);