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
    vm.EndOfAudioPlayCallback = null;

    var context = DataService.CreateOrGetContext();
    var source = context.createBufferSource(); // creates a sound source

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

                if (DataService.isMobileDevice || DataService.oSetUpIssues.bHasSetupIssue()) {
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
                            if (DataService.isMobileDevice || DataService.oSetUpIssues.bHasSetupIssue()) {
                                that.InitPersonalTab();
                            }
                        }
                    }
                });
            }
        },
        InitAssessments: function() {
            var bItemToBeAssessedFound = false;
            vm.tempAssessments.forEach(function(oItem) {
                // This is to find, which assessment has already been completed
                // If responseTextId property is not present, then that one has not been assessed

                // if (!bItemToBeAssessedFound && oItem.responseTextId === undefined && false) {
                if (!bItemToBeAssessedFound && oItem.responseTextId === undefined) {
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
            // Get audio instruction of loaded assessments
            this.GetAssessmentAudioInstruction();
            delete vm.tempAssessments;

            // if (!bItemToBeAssessedFound && false) {
            if (!bItemToBeAssessedFound) {
                // Could not find any assessment which was not completed before. So all assessments have been completed.
                DataService.bAssessmentsCompleted = true;
                this.TransitionState('home');
                return false;
            }
            return true;
        },
        InitTab: function() {
            vm.assessments.forEach(function(oAssessment) {
                vm.tabs.push({ title: oAssessment.name, state: oAssessment.nickName, content: oAssessment.nickName + '.html', disabled: false });
            });
        },
        InitCurrentTab: function() {
            vm.currentTab = [vm.tabs[vm.currentTabIndex]];
            vm.currentAssessment = vm.assessments[vm.currentTabIndex];
            // If this assessment does not have any audio, then skip
            if (vm.currentAssessment.oAudioInstruction.oAudio) {
                if (vm.currentAssessment.oAudioInstruction.sType === 'list') {
                    // if this is a list, then the instruction will be in the zero'th index                    
                    vm.currentAssessment.oAudioInstruction.nNextIndexToBePlayed = 0;
                    this.GetNextAudioInstructionFromList();
                } else {
                    vm.Helper.PlaySound(vm.currentAssessment.oAudioInstruction.oAudio);
                }
            }
            this.TransitionState('assessments.' + vm.currentTab[0].state);
        },
        ShowHidePager: function(bShow, sMessage) {
            vm.bShowPager = bShow;
            vm.sShowPagerMessage = sMessage;
        },
        InitPersonalTab: function() {
            // Go to last Tab
            vm.currentTabIndex = vm.tabs.length - 1;
            var sMessage = "";
            if (DataService.isMobileDevice) {
                sMessage = Constants.Miscellaneous.IsMobileDevice;
            } else if (DataService.oSetUpIssues.bHasMicrophoneIssue) {
                sMessage = Constants.Miscellaneous.bHasMicrophoneIssue;
            } else if (DataService.oSetUpIssues.bHasSpeakerIssue) {
                sMessage = Constants.Miscellaneous.bHasSpeakerIssue;
            }
            CommonFactory.Notification.error({ message: sMessage, delay: null });

            var oPersonal = CommonFactory.FindItemInArray(vm.assessments, 'nickName', 'personal', 'item');
            if (oPersonal) {
                oPersonal.description = Constants.PersonalAssessment.EnterEmail;
                var arrQuestions = CommonFactory.FindItemInArray(oPersonal.arrQuestions, 'questionId', '18', 'item');
                oPersonal.arrQuestions = [];
                if (arrQuestions) {
                    oPersonal.arrQuestions.push(arrQuestions);
                }
            }
        },
        PlaySound: function(buffer) {
            if (source.buffer) {
                source.disconnect();
                source = context.createBufferSource();
            }
            source.onended = this.EndOfAudioPlay;
            source.buffer = buffer; // tell the source which sound to play
            source.connect(context.destination); // connect the source to the context's destination (the speakers)
            source.start(0); // play the sourc            
        },
        EndOfAudioPlay: function() {
            if (vm.EndOfAudioPlayCallback) {
                vm.EndOfAudioPlayCallback();
                $scope.$apply();
            }
            //console.log("Done playing instruction");
        },
        GetNextAudioInstructionFromList: function() {
            var nNextIndexToBePlayed = vm.currentAssessment.oAudioInstruction.nNextIndexToBePlayed++;
            vm.Helper.PlaySound(vm.currentAssessment.oAudioInstruction.oAudio[nNextIndexToBePlayed]);
        },
        FinishedLoadingAudio(arrBuffers) {
            var nBufferIndex = 0;
            vm.assessments.forEach(function(oAssessment, index) {
                oAudioInstruction = vm.assessments[index].oAudioInstruction;
                if (oAudioInstruction.sType === 'list') {
                    oAudioInstruction.nSubListLength
                    for (var i = 0; i < oAudioInstruction.nSubListLength; i++) {
                        oAudioInstruction.oAudio.push(arrBuffers[nBufferIndex++]);
                    }
                } else {
                    oAudioInstruction.oAudio = arrBuffers[nBufferIndex++];
                }
            });
            //console.log(vm.assessments);
            vm.Helper.InitCurrentTab();
            vm.Helper.ShowHidePager(true, null);
            $scope.$apply();
        },
        GetAssessmentAudioInstruction: function() {
            var arrInstructions = [];
            for (var i = 0; i < vm.assessments.length; i++) {
                var oAudioInstruction = null;
                // sentenceRepetition has 3 sub_audio
                var sAssessmentName = "reading";
                if (vm.assessments[i].nickName === sAssessmentName) {
                    var arrSuffix = ["_0", "_1", "_2", "_3"];
                    oAudioInstruction = {
                        oAudio: [],
                        sStatus: 'created',
                        sType: 'list',
                        nSubListLength: arrSuffix.length,
                        nNextIndexToBePlayed: 0
                    }
                    arrSuffix.forEach(function(sSuffix) {
                        arrInstructions.push(sAssessmentName + sSuffix);
                    });
                } else {
                    oAudioInstruction = {
                        oAudio: null,
                        sStatus: 'created',
                        sType: 'single'
                    }
                    arrInstructions.push(vm.assessments[i].nickName);
                }
                vm.assessments[i].oAudioInstruction = oAudioInstruction;
            }
            var bufferLoader = new BufferLoader(
                context, arrInstructions,
                this.FinishedLoadingAudio,
                DataService.GetAssessmentAudioInstruction
            );
            bufferLoader.load();
        }
    }

    $scope.$on('$locationChangeStart', function(event, next, current) {
        // Here you can take the control and call your own functions:
        CommonFactory.PreventGoingToDifferentPage(event, next, current, DataService);
    });

    vm.Helper.GetUserMedia();
}
