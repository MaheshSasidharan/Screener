app.controller('PersonalController', ['$scope', 'Factory_Constants', 'Factory_CommonRoutines', 'Factory_DataService', PersonalController]);

function PersonalController($scope, Constants, CommonFactory, DataService) {
    var pe = this;
    pe.isMobileDevice = DataService.isMobileDevice;
    pe.arrPublicSchool = Constants.Assessments.arrDropDowns.PublicSchool;
    pe.arrCheckedSchools = [];

    var nPublicSchoolQuestionIndex = 4;

    var oText = $scope.$parent.vm.currentAssessment.arrQuestions[nPublicSchoolQuestionIndex];
    if (oText && oText.response) {
        var arrTempSchool = JSON.parse(oText.response);        

        arrTempSchool.forEach(function(sSchoolType){
        	var oSchool = CommonFactory.FindItemInArray(pe.arrPublicSchool, 'val', sSchoolType, 'item');
        	pe.arrCheckedSchools.push(oSchool);	
        });
    }



    pe.Helper = {
        UpdateCheckbox: function(school) {
            if (pe.arrCheckedSchools.indexOf(school) === -1) {
                pe.arrCheckedSchools.push(school);
            } else {
                pe.arrCheckedSchools.splice(pe.arrCheckedSchools.indexOf(school), 1);
            }


            var sResponse = [];
            pe.arrCheckedSchools.forEach(function(oSchool) {
                sResponse.push(oSchool.val);
            });            

            var oText = $scope.$parent.vm.currentAssessment.arrQuestions[nPublicSchoolQuestionIndex];
            if (oText) {
                oText.response = JSON.stringify(sResponse);
            }
        },
        Checked: function(oItem, arrItems){
            return arrItems.indexOf(oItem) > -1;
        }
    }
}