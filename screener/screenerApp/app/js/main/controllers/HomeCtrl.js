app.controller('NavCtrl', ['$scope', '$location', function($scope, $location) {
    var vm = this;
    vm.Helper = {
        UpdateTabActive: function(sTab) {
            return window.location.hash && window.location.hash.toLowerCase() == ("#/" + sTab).toLowerCase() ? 'active' : '';
        }
    }
}]);

app.controller('HomeCtrl', ['$scope', '$state', 'Factory_Constants', 'Factory_DataService', 'Factory_CommonRoutines', function($scope, $state, Constants, DataService, CommonFactory) {
    var vm = this;
    vm.bAssessmentsCompleted = DataService.bAssessmentsCompleted;
    vm.sAssessmentCompletedText = DataService.isMobileDevice ? Constants.Home.EmailSaved : Constants.Home.AssessmentCompleted;

    vm.Helper = {
        StartAssessment: function() {
            $state.transitionTo('screener.setup');
            //$state.transitionTo('screener.assessments');
        }
    }

    //$scope.$on('$locationChangeStart', CommonFactory.PreventGoingToDifferentPage);

    $scope.$on('$locationChangeStart', function(event, next, current) {
        // Here you can take the control and call your own functions:
        CommonFactory.PreventGoingToDifferentPage(event, next, current, DataService);
    });

}]);
