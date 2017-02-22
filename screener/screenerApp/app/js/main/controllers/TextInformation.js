app.controller('TextInformation', ['$scope', 'Factory_Constants', 'Factory_CommonRoutines', 'Factory_DataService', TextInformation]);

function TextInformation($scope, Constants, CommonFactory, DataService) {
    var ti = this;
    
    var oText = $scope.$parent.vm.currentAssessment.arrQuestions[0];
    if (oText) {
        oText.response = CommonFactory.TryConvertStringToDate(oText.response);
    }
}
