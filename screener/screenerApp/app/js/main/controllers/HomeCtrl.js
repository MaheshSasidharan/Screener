app.controller('NavCtrl', ['$scope', '$location', function($scope, $location) {
    var vm = this;
    vm.Helper = {
        UpdateTabActive: function(sTab) {
            return window.location.hash && window.location.hash.toLowerCase() == ("#/" + sTab).toLowerCase() ? 'active' : '';
        }
    }
}]);

app.controller('HomeCtrl', ['$scope', '$state', '$location', 'Factory_Constants', 'Factory_DataService', 'Factory_CommonRoutines', function($scope, $state, $location, Constants, DataService, CommonFactory) {
    var vm = this;
    vm.bAssessmentsCompleted = DataService.bAssessmentsCompleted;
    vm.sAssessmentCompletedText = DataService.isMobileDevice ? Constants.Home.EmailSaved : Constants.Home.AssessmentCompleted;

    vm.oService = {
        SaveUserSource: function(source) {
            return DataService.SaveUserSource(source).then(function(data) {
                if (data.status) {
                    return data;
                } else {
                    console.log("Failed to save source");
                }
            });
        }
    }

    vm.Helper = {
        StartAssessment: function() {
            $state.transitionTo('screener.setup');
            //$state.transitionTo('screener.assessments');
        }
    }

    vm.location = $location;
    $scope.$watch('vm.location.search()', function() {
        vm.source = ($location.search()).source;
        if (vm.source && vm.source.trim() !== "") {
            vm.oService.SaveUserSource(vm.source).then(function() {
                $location.search("source", null);
            });
        }
    }, true);

    //$scope.$on('$locationChangeStart', CommonFactory.PreventGoingToDifferentPage);

    $scope.$on('$locationChangeStart', function(event, next, current) {
        // Here you can take the control and call your own functions:
        CommonFactory.PreventGoingToDifferentPage(event, next, current, DataService);
    });

}]);
