app.controller('PicturePrompt', ['$scope', '$timeout', '$interval', 'Factory_Constants', 'Factory_CommonRoutines', 'Factory_DataService', PicturePrompt]);

function PicturePrompt($scope, $timeout, $interval, Constants, CommonFactory, DataService) {
    $scope.$parent.vm.Helper.ShowHidePager(true);
    
}
