// Sub-application/main Level State
app.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {

  $stateProvider
    .state('screener.home', {
      url: '/home',
      templateUrl: 'templates/main/home.tpl.html',
      controller: 'HomeCtrl as vm'
    })
    .state('screener.about', {
      url: '/about',
      templateUrl: 'templates/main/about.tpl.html',
      controller: 'AboutCtrl as vm'
    })
    .state('screener.contact', {
      url: '/contact',
      templateUrl: 'templates/main/contact.tpl.html',
      controller: 'ContactCtrl as vm'
    })
    .state('screener.assessments', {
      url: '/assessments',
      templateUrl: 'templates/assessments/assessments.html',
      controller: 'AssessmentsCtrl as vm'
    })
            .state('screener.assessments.text', {
              templateUrl: 'templates/assessments/text.html',
              controller: 'TextInformation as ti'
            })
            .state('screener.assessments.timeDuration', {
              templateUrl: 'templates/assessments/timeDuration.html',
              controller: 'TimeDuration as td'
            })
            .state('screener.assessments.metronome', {
              templateUrl: 'templates/assessments/metronome.html',
              controller: 'Metronome as me'
            })
            .state('screener.assessments.syncVoice', {
              templateUrl: 'templates/assessments/syncVoice.html',
              controller: 'SyncVoice as sv'
            })
            .state('screener.assessments.picturePrompt', {
              templateUrl: 'templates/assessments/picturePrompt.html',
              controller: 'PicturePrompt as pp'
            })
            .state('screener.assessments.matrixReasoning', {
              templateUrl: 'templates/assessments/matrixReasoning.html',
              controller: 'MatrixController as ma'
            })
            .state('screener.assessments.sentenceRepetition', {
              templateUrl: 'templates/assessments/sentenceRepetition.html',
              controller: 'SentenceRepetitionController as au'
            })
            .state('screener.assessments.wordFinding', {
              templateUrl: 'templates/assessments/wordFinding.html',
              controller: 'WordFindingController as wo'
            })
            .state('screener.assessments.reading', {
              templateUrl: 'templates/assessments/reading.html',
              controller: 'ReadingController as re'
            })
            .state('screener.assessments.personal', {
              templateUrl: 'templates/assessments/personal.html',
              controller: 'PersonalController as pe'
            });
            // .state('screener.assessments.video', {
            //   templateUrl: 'templates/assessments/video.html',
            //   controller: 'VideoCtrl as vid'
            // });
    $urlRouterProvider.otherwise('/home');
}]);