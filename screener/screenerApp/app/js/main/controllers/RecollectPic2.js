app.controller('RecollectPic2', ['$scope', '$timeout', '$interval', '$sce', 'Factory_Constants', 'Factory_CommonRoutines', 'Factory_DataService', RecollectPic2]);

function RecollectPic2($scope, $timeout, $interval, $sce, Constants, CommonFactory, DataService) {
    var rp2 = this;
    var bFirst = true;
    rp2.src = null;
    var arrImages = null;
    var arrImageResponse = [];
    var responseTime = null;
    rp2.nCurrentPicSetIndex = 0;
    rp2.bShowStartButton = false;
    rp2.sTextOnPlayButton = "Start";

    var timeoutObject = null;
    var nDisplaySeconds = Constants.RecollectPic2.nDisplaySeconds * 1000;

    var sGetPicEndPoint = "GetRecolletAssessment";
    var sRecollectType = Constants.RecollectPic2.sAssessmentType;

    rp2.oService = {
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

    rp2.Helper = {
        Init: function() {
            // Hide NextAssessment button
            $scope.$parent.vm.Helper.ShowHidePager(false);
            // Turn on practice mode
            $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Final";
            rp2.oService.GetPicNamesMatrixAssessment().then(function(arrPicNames) {
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
                                    var sSource = rp2.oService.GetSourceAddress();
                                    var sMatrixAssessment = sSource + sGetPicEndPoint;

                                    var sTempSetName = arrImages[arrImages.length - 1].sSetName;
                                    var sTempPicName = sPicName;
                                    var sTempPicURL = sMatrixAssessment + "?sRecollectPicType=" + sRecollectType + "&sSetType=" + sTempSetName + "&sPicName=" + sTempPicName;
                                    var oPic = {
                                        sPicName: sTempPicName,
                                        sPicURL: sTempPicURL,
                                        bSelected: false
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
            rp2.bShowStartButton = true;
        },
        PlayNext: function(sType) {
            if (sType == "next") {
                rp2.Helper.GetMartixImages();
                if (bFirst) {
                    rp2.sTextOnPlayButton = "Start";
                    bFirst = false;
                } else {
                    $scope.$parent.vm.currentAssessment.arrQuestions[0].sMode = "Final";
                    rp2.sTextOnPlayButton = "Next";
                }
            }
        },
        GetMartixImages: function() {
            if (arrImages.length === rp2.nCurrentPicSetIndex) {
                rp2.oCurrentSet = null;
                if ($scope.$parent) {
                    $scope.$parent.vm.Helper.ShowHidePager(true, Constants.Miscellaneous.AssessmentCompleteNext);
                    rp2.bShowStartButton = false;
                    $scope.$parent.vm.currentAssessment.arrQuestions[0].response = JSON.stringify(arrImageResponse);
                }
                // After callback make sure no vm is present in object
                return;
            }
            rp2.bShowStartButton = false;
            var oCurrentSet = arrImages[rp2.nCurrentPicSetIndex++];

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

            rp2.oCurrentSet = oCurrentSet;
            responseTime = new Date();
            if (timeoutObject) {
                $timeout.cancel(timeoutObject);
            }
            timeoutObject = $timeout(function() {
                rp2.Helper.PlayNext('next');
            }, nDisplaySeconds);
        },
        AnswerSelected: function(oPic) {
            var responseTimeDiff = new Date() - responseTime;

            // Check if present selected pic exists
            var bFound = false;
            for (var i = 0; i < arrImageResponse.length; i++) {
                if (arrImageResponse[i].sPicName === oPic.sPicName) {
                    bFound = true;
                    break;
                }
            }
            if (bFound) {
                var oIMG = arrImageResponse[i];
                oIMG.responseTime = responseTimeDiff;
                oIMG.arrResponseTime.push(responseTimeDiff);
                if (oIMG.bSelected) {
                    oIMG.nDeSelectCount++;
                } else {
                    oIMG.nSelectCount++;
                }
                oIMG.bSelected = !oIMG.bSelected;
                oPic.bSelected = oIMG.bSelected;
            } else {
                var oIMG = {
                    sPicName: oPic.sPicName,
                    bSelected: true,
                    nSelectCount: 1,
                    nDeSelectCount: 0,
                    responseTime: responseTimeDiff,
                    arrResponseTime: [responseTimeDiff]
                }
                arrImageResponse.push(oIMG);
                oPic.bSelected = oIMG.bSelected;
            }
            //rp2.Helper.PlayNext('next');
        }
    }
    rp2.Helper.Init();
}
