app.controller('NavCtrl', ['$scope', '$location', function($scope, $location) {
    var vm = this;
    vm.Helper = {
        UpdateTabActive: function(sTab){
            return window.location.hash && window.location.hash.toLowerCase() == ("#/" + sTab).toLowerCase() ? 'active' : '';
        }
    }    
}]);

app.controller('HomeCtrl', ['$scope','$state', function($scope, $state) {
    var vm = this;
    vm.Helper = {
    	StartAssessment: function(){
    		$state.transitionTo('screener.assessments');
    	}
    }
}]);