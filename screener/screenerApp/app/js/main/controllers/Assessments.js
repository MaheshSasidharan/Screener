app.controller('AssessmentsCtrl', ['$scope', '$state', 'Factory_Constants', 'Factory_DataService', 'Factory_CommonRoutines', AssessmentsCtrl]);

function AssessmentsCtrl($scope, $state, Constants, DataService, CommonFactory) {
    var vm = this;
    vm.tabs = [];
    vm.sShowPagerMessage = null;
    vm.bShowPager = false;
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
        TransitionState: function(state) {
            if (state) {
                $state.transitionTo('screener.' + state);
            }
        },
        PreviousAssessment: function() {
            var that = this;
            vm.Helper.SaveAssessments().then(function() {
                vm.currentTabIndex--;
                that.InitCurrentTab();
            });
        },
        NextAssessment: function(bGoNext) {
            var that = this;
            vm.Helper.SaveAssessments().then(function() {
                if (bGoNext) {
                    vm.currentTabIndex++;
                    that.InitCurrentTab();
                } else { // If assessment is completed
                    DataService.bAssessmentsCompleted = true;
                    that.TransitionState('home');
                }
            });
        },
        GetTemplateURL: function(sPartialURL) {
            return '' + sPartialURL + '';
        },
        HasGetUserMedia: function() {
            return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia || navigator.msGetUserMedia);
        },
        GetUserMedia: function() {
            if (this.HasGetUserMedia()) {
                // Check if phone is being used
                DataService.isMobileDevice = navigator.userAgent.match(/iPad|iPhone|iPod|android/i) != null || screen.width <= 480;

                if (DataService.isMobileDevice) {
                    vm.Helper.Init();
                    return;
                }
                navigator.webkitGetUserMedia({ audio: true, video: true }, function() {
                    vm.Helper.Init();
                }, function() {
                    CommonFactory.Notification.error({ message: Constants.Miscellaneous.FailedMediaAccess, delay: null });
                });
            } else {
                CommonFactory.Notification.error({ message: Constants.Miscellaneous.NoBrowserSupport, delay: null });
            }
        },
        Init: function() {
            // This is just to check if client has completed assessment. This does not need a page refresh
            if (DataService.bAssessmentsCompleted) {
                this.TransitionState('home');
            } else {
                var that = this;
                vm.oService.GetAssessments().then(function(data) {
                    if (data.status) {
                        if (that.InitAssessments()) {
                            that.InitTab();
                            if (DataService.isMobileDevice) {
                                that.InitPersonalTab();
                            }
                            that.InitCurrentTab();
                            that.ShowHidePager(true, null);
                        }
                    }
                });
            }
        },
        InitAssessments: function() {
            var bItemToBeAssessedFound = false;
            vm.tempAssessments.forEach(function(oItem) {
                // This is to find, which assessment has already been completed
                if (!bItemToBeAssessedFound && oItem.responseTextId === undefined) { // If responseTextId property is not present, then that one has not been assessed
                    bItemToBeAssessedFound = true;
                    vm.currentTabIndex = vm.assessments.length;
                }

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

            if (false && !bItemToBeAssessedFound) {
                //if (!bItemToBeAssessedFound) {
                // Could not find any assessment which was not completed before. So all assessments have been completed.
                DataService.bAssessmentsCompleted = true;
                this.TransitionState('home');
                return false;
            }
            return true;

            //vm.assessments[0].arrQuestions[0].response = CommonFactory.TryConvertStringToDate(vm.assessments[0].arrQuestions[0].response);
            //vm.assessments[7].arrQuestions[0].response = CommonFactory.GetRandomCharacter();
            //vm.assessments[8].arrQuestions[0].displayedResponse = "---";
        },
        InitTab: function() {
            vm.assessments.forEach(function(oAssessment) {
                vm.tabs.push({ title: oAssessment.name, state: oAssessment.nickName, content: oAssessment.nickName + '.html', disabled: false });
            });
        },
        InitCurrentTab: function() {
            vm.currentTab = [vm.tabs[vm.currentTabIndex]];
            vm.currentAssessment = vm.assessments[vm.currentTabIndex];
            this.TransitionState('assessments.' + vm.currentTab[0].state);
        },
        ShowHidePager: function(bShow, sMessage) {
            vm.bShowPager = bShow;
            vm.sShowPagerMessage = sMessage;
        },
        InitPersonalTab: function() {
            // Go to last Tab
            vm.currentTabIndex = vm.tabs.length - 1;
            CommonFactory.Notification.error({ message: Constants.Miscellaneous.IsMobileDevice, delay: null });

            var oPersonal = CommonFactory.FindItemInArray(vm.assessments, 'nickName', 'personal', 'item');
            if (oPersonal) {
                oPersonal.description = Constants.PersonalAssessment.EnterEmail;
                var arrQuestions = CommonFactory.FindItemInArray(oPersonal.arrQuestions, 'questionId', '14', 'item');
                oPersonal.arrQuestions = [];
                if (arrQuestions) {
                    oPersonal.arrQuestions.push(arrQuestions);
                }
            }
        }
    }

    $scope.$on('$locationChangeStart', CommonFactory.PreventGoingToDifferentPage);

    vm.Helper.GetUserMedia();
}
