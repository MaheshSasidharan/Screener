app.controller('RecollectPic1', ['$scope', '$timeout', '$interval', 'Factory_Constants', 'Factory_CommonRoutines', 'Factory_DataService', RecollectPic1]);

function RecollectPic1($scope, $timeout, $interval, Constants, CommonFactory, DataService) {
    var rp1 = this;
    var bFirst = true;
    rp1.src = null;
    var arrImages = null;
    var arrImageResponse = [];
    var responseTime = null;
    rp1.nCurrentPicSetIndex = 0;
    rp1.oCurrentPic = null;
    rp1.bShowStartButton = false;
    rp1.sTextOnPlayButton = "Start";

    var timeoutObject = null;
    
    var sGetPicEndPoint = "GetRecolletAssessment";
    var sRecollectType = Constants.RecollectPic1.sAssessmentType;
    var nDisplaySeconds = Constants.RecollectPic1.nDisplaySeconds * 1000;

    rp1.oService = {
        GetSourceAddress: function() {
            return DataService.GetSourceAddress();
        },
        GetPicNamesMatrixAssessment: function() {
            return DataService.GetPicNamesMatrixAssessment(sRecollectType).then(function(data) {
                if (data.status) {
                    return data.arrPicNames;
                } else {
                    alert(data.msg);
                    return [];
                }
            });
        }
    }

    rp1.Helper = {
        Init: function() {
            // Hide NextAssessment button
            $scope.$parent.vm.Helper.ShowHidePager(false);
            // Turn on practice mode
            $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Final";
            rp1.oService.GetPicNamesMatrixAssessment().then(function(arrPicNames) {
                if (arrPicNames.length) {
                    arrPicNames.forEach(function(sPicName) {
                        var nNumberOfSlashes = (sPicName.match(/\//g) || []).length;
                        switch (nNumberOfSlashes) {
                            case 0:
                                var sSetName = sPicName;
                                if (!arrImages) {
                                    arrImages = [];
                                }
                                arrImages.push({ sSetName: sSetName });
                                break;
                            case 1:
                                var sPicName = sPicName.substr(sPicName.indexOf("/") + 1);
                                if (sPicName.indexOf(".dimension") >= 0) {
                                    var sDimension = sPicName.substring(sPicName.lastIndexOf("/") + 1, sPicName.indexOf(".dimension")).split("x");
                                    arrImages[arrImages.length - 1].nWidth = sDimension[0];
                                    arrImages[arrImages.length - 1].nHeight = sDimension[1];
                                    return;
                                } else {
                                    if (!arrImages[arrImages.length - 1].arroPics) {
                                        arrImages[arrImages.length - 1].arroPics = [];
                                    }
                                    var sSource = rp1.oService.GetSourceAddress();
                                    var sMatrixAssessment = sSource + sGetPicEndPoint;

                                    var sTempSetName = arrImages[arrImages.length - 1].sSetName;
                                    var sTempPicName = sPicName;
                                    var sTempPicURL = sMatrixAssessment + "?sRecollectPicType=" + sRecollectType + "&sSetType=" + sTempSetName + "&sPicName=" + sTempPicName;
                                    var oPic = {
                                        sPicName: sTempPicName,
                                        sPicURL: sTempPicURL,
                                        isSelected: false
                                    }
                                    arrImages[arrImages.length - 1].arroPics.push(oPic);
                                };
                                break;
                        }
                    });
                    //arrImages = CommonFactory.RandomizeSolutionSet(arrImages, 'matrix');
                }
            });
            $scope.$parent.vm.EndOfAudioPlayCallback = this.AfterInstructionPlayed;
        },
        AfterInstructionPlayed: function() {
            rp1.bShowStartButton = true;
        },
        PlayNext: function(sType) {
            if (sType == "next") {
                rp1.Helper.GetMartixImages();
                if (bFirst) {
                    rp1.sTextOnPlayButton = "Start";
                    bFirst = false;
                } else {
                    $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Final";
                    rp1.sTextOnPlayButton = "Next";
                }
            }
        },
        GetMartixImages: function() {
            if (rp1.oCurrentPic) { // If an answer is selected, save that
                var selectOptions = [];
                rp1.oCurrentSet.arroPics.forEach(function(oPic) {
                    selectOptions.push(oPic.sPicName);
                });
                var oImageResponse = {
                    setName: rp1.oCurrentSet.sSetName,
                    selectedPic: rp1.oCurrentPic.sPicName,
                    selectOptions: selectOptions,
                    responseTime: responseTime
                }
                arrImageResponse.push(oImageResponse);
            }
            if (arrImages.length === rp1.nCurrentPicSetIndex) {
                rp1.oCurrentSet = null;
                $scope.$parent.vm.Helper.ShowHidePager(true, Constants.Miscellaneous.AssessmentCompleteNext);
                rp1.bShowStartButton = false;
                $scope.$parent.vm.currentAssessment.arrQuestions[0].response = JSON.stringify(arrImageResponse);
                return;
            }
            rp1.oCurrentPic = null;
            rp1.bShowStartButton = false;
            var oCurrentSet = arrImages[rp1.nCurrentPicSetIndex++];

            oCurrentSet.arrURLs = [];
            var nNextImageIndex = 0;
            for (var i = 0; i < oCurrentSet.nHeight; i++) {
                for (var j = 0; j < oCurrentSet.nWidth; j++) {
                    if (!oCurrentSet.arrURLs[i]) {
                        oCurrentSet.arrURLs[i] = [];
                    }
                    oCurrentSet.arrURLs[i][j] = oCurrentSet.arroPics[nNextImageIndex++];
                }
            }

            rp1.oCurrentSet = oCurrentSet;
            responseTime = new Date();

            // Get next after n seconds
            if (timeoutObject) {
                $timeout.cancel(timeoutObject);
            }
            timeoutObject = $timeout(function() {
                rp1.Helper.PlayNext('next');
            }, nDisplaySeconds);
        },
        AnswerSelected: function(oPic) {
            responseTime = new Date() - responseTime;
            rp1.oCurrentPic = oPic;
            rp1.Helper.PlayNext('next');
        }
    }
    rp1.Helper.Init();
}
