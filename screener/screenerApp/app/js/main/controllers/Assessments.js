app.controller('AssessmentsCtrl', ['$scope', '$state', 'Factory_Constants', 'Factory_DataService', 'Factory_CommonRoutines', AssessmentsCtrl]);

function AssessmentsCtrl($scope, $state, Constants, DataService, CommonFactory) {
    var vm = this;
    vm.tabs = [];
    vm.sShowPagerMessage = null;
    vm.bShowPager = true;
    vm.currentTabIndex = 0;
    vm.currentTab = [];
    vm.tempAssessments = [];
    vm.assessments = [];
    vm.arrDropDowns = Constants.Assessments.arrDropDowns;
    vm.oService = {
        GetAssessments: function() {
            return DataService.GetAssessments().then(function(data) {
                if (data.status) {
                    vm.tempAssessments = data.assessments;
                    return data;
                } else {
                    alert(data.msg);
                }
            });
        },
        SaveAssessments: function() {
            return DataService.SaveAssessments(vm.currentAssessment.arrQuestions).then(function(data) {
                if (data.status) {
                    return data;
                } else {
                    alert(data.msg);
                }
            });
        }
    }

    vm.Helper = {
        SaveAssessments: function() {
            if (vm.currentAssessment.arrQuestions && vm.currentAssessment.arrQuestions[0].questionId) {
                return vm.oService.SaveAssessments().then(function(data) {
                    if (data.status) {
                        if (data.insertedId && data.insertedId.insertId) {
                            // Data has been inserted
                            var nInsertId = data.insertedId.insertId;
                            vm.currentAssessment.arrQuestions.forEach(function(oItem) {
                                oItem.responseTextId = nInsertId++;
                            });
                        }
                        return data;
                    }
                });
            } else {
                return Promise.resolve();
            }
        },
        Init: function() {
            var that = this;
            vm.oService.GetAssessments().then(function(data) {
                if (data.status) {
                    that.InitAssessments();
                    that.InitTab();
                }
            });
        },
        TransitionState: function(state) {
            if (state) {
                $state.transitionTo('screener.assessments.' + state);
            }
        },
        PreviousAssessment: function() {
            var that = this;
            vm.Helper.SaveAssessments().then(function() {
                vm.currentTabIndex--;
                that.InitCurrentTab();
            });
        },
        NextAssessment: function() {
            var that = this;
            vm.Helper.SaveAssessments().then(function() {
                vm.currentTabIndex++;
                that.InitCurrentTab();
            });
        },
        InitAssessments: function() {
            vm.tempAssessments.forEach(function(oItem) {
                var assessmentIndex = CommonFactory.FindItemInArray(vm.assessments, 'assessmentId', oItem.assessmentId, 'index');
                // If it exists, add questions to it, else create one
                if (assessmentIndex) {
                    vm.assessments[assessmentIndex].arrQuestions = vm.assessments[assessmentIndex].arrQuestions ? vm.assessments[assessmentIndex].arrQuestions : [];
                    vm.assessments[assessmentIndex].arrQuestions.push({
                        questionId: oItem.questionId,
                        question: oItem.question,
                        response: oItem.response ? oItem.response : null,
                        responseTextId: oItem.responseTextId
                    });
                } else {
                    vm.assessments.push({
                        assessmentId: oItem.assessmentId,
                        name: oItem.name,
                        nickName: oItem.nickName,
                        description: oItem.description,
                        arrQuestions: [{
                            questionId: oItem.questionId,
                            question: oItem.question,
                            response: oItem.response ? oItem.response : null,
                            responseTextId: oItem.responseTextId
                        }]
                    });
                }
            });
            delete vm.tempAssessments;
            // Individual formatting
            vm.assessments[0].arrQuestions[0].response = CommonFactory.TryConvertStringToDate(vm.assessments[0].arrQuestions[0].response);
            vm.assessments[5].arrQuestions[0].response = CommonFactory.GetRandomCharacter();
            vm.assessments[5].arrQuestions[0].displayedResponse = "---";
        },
        InitTab: function() {
            vm.assessments.forEach(function(oAssessment) {
                vm.tabs.push({ title: oAssessment.name, state: oAssessment.nickName, content: oAssessment.nickName + '.html', disabled: false });
            });
            this.InitCurrentTab();
        },
        InitCurrentTab: function() {
            vm.currentTab = [vm.tabs[vm.currentTabIndex]];
            vm.currentAssessment = vm.assessments[vm.currentTabIndex];
            this.TransitionState(vm.currentTab[0].state);
        },
        GetTemplateURL: function(sPartialURL) {
            return '' + sPartialURL + '';
        },
        ShowHidePager: function(bShow, sMessage) {
            vm.bShowPager = bShow;
            vm.sShowPagerMessage = sMessage;
        }
    }
    vm.Helper.Init();
}