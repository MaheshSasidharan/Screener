app.controller('MatrixController', ['$scope', '$timeout', '$interval', '$sce', 'Factory_Constants', 'Factory_CommonRoutines', 'Factory_DataService', MatrixController]);

function MatrixController($scope, $timeout, $interval, $sce, Constants, CommonFactory, DataService) {
    $scope.$parent.vm.Helper.ShowHidePager(false);
    var ma = this;
    ma.src = null;
    var arrImages = null;
    var arrImageResponse = [];
    var responseTime = null;
    ma.nCurrentPicSetIndex = 0;
    ma.oCurrentPic = null;
    ma.bShowNextButton = false;
    ma.oService = {
        GetSourceAddress: function() {
            return DataService.GetSourceAddress();
        },
        GetPicNamesMatrixAssessment: function() {
            return DataService.GetPicNamesMatrixAssessment().then(function(data) {
                if (data.status) {
                    return data.arrPicNames;
                } else {
                    alert(data.msg);
                    return [];
                }
            });
        }
    }

    ma.Helper = {
        Init: function() {
            ma.oService.GetPicNamesMatrixAssessment().then(function(arrPicNames) {
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
                                var sSetType = sPicName.substr(sPicName.indexOf("/") + 1);
                                var nSetTypeReferenceName = null;
                                arrImages[arrImages.length - 1][sSetType] = { sSetType: sSetType };
                                break;
                            case 2:
                                var sSetType = sPicName.substring(sPicName.indexOf("/") + 1, sPicName.lastIndexOf("/"));
                                if (sPicName.indexOf(".dimension") >= 0) {
                                    var sDimension = sPicName.substring(sPicName.lastIndexOf("/") + 1, sPicName.indexOf(".dimension")).split("x");
                                    arrImages[arrImages.length - 1][sSetType].nWidth = sDimension[0];
                                    arrImages[arrImages.length - 1][sSetType].nHeight = sDimension[1];
                                    return;
                                } else {
                                    if (!arrImages[arrImages.length - 1][sSetType].arroPics) {
                                        arrImages[arrImages.length - 1][sSetType].arroPics = [];
                                    }
                                    var sSource = ma.oService.GetSourceAddress();
                                    var sMatrixAssessment = sSource + "GetMatrixAssessment";

                                    var sTempSetName = arrImages[arrImages.length - 1].sSetName;
                                    var sTempSetType = arrImages[arrImages.length - 1][sSetType].sSetType;
                                    var sTempPicName = sPicName.substring(sPicName.lastIndexOf("/") + 1);
                                    var sTempPicURL = sMatrixAssessment + "?sSetName=" + sTempSetName + "&sSetType=" + sTempSetType + "&sPicName=" + sTempPicName;
                                    var oPic = {
                                        sPicName: sTempPicName,
                                        sPicURL: sTempPicURL,
                                        isSelected: false
                                    }
                                    arrImages[arrImages.length - 1][sSetType].arroPics.push(oPic);
                                };
                                break;
                        }
                    });
                    arrImages = CommonFactory.RandomizeSolutionSet(arrImages);
                }
                ma.Helper.GetMartixImages();
            });
        },
        GetMartixImages: function() {
            if(ma.oCurrentPic){ // If an answer is selected, save that
                var selectOptions = [];
                ma.oCurrentSet.solutionSets.arroPics.forEach(function(oPic){
                    selectOptions.push(oPic.sPicName);
                });
                var oImageResponse = {
                    setName: ma.oCurrentSet.sSetName,
                    selectedPic: ma.oCurrentPic.sPicName,
                    selectOptions: selectOptions,
                    responseTime: responseTime
                }
                arrImageResponse.push(oImageResponse);
            }
            if (arrImages.length === ma.nCurrentPicSetIndex) {
                ma.oCurrentSet = null;
                $scope.$parent.vm.Helper.ShowHidePager(true, Constants.Miscellaneous.AssessmentCompleteNext);
                ma.bShowNextButton = false;
                $scope.$parent.vm.currentAssessment.arrQuestions[0].response = JSON.stringify(arrImageResponse);
                return;
            }
            ma.oCurrentPic = null;
            ma.bShowNextButton = false;
            var oCurrentSet = arrImages[ma.nCurrentPicSetIndex++];

            var arrImageTypes = ["frameSets", "solutionSets"];
            arrImageTypes.forEach(function(sImageType) {
                oCurrentSet[sImageType].arrURLs = [];
                var nNextImageIndex = 0;
                for (var i = 0; i < oCurrentSet[sImageType].nHeight; i++) {
                    for (var j = 0; j < oCurrentSet[sImageType].nWidth; j++) {
                        if (!oCurrentSet[sImageType].arrURLs[i]) {
                            oCurrentSet[sImageType].arrURLs[i] = [];
                        }
                        oCurrentSet[sImageType].arrURLs[i][j] = oCurrentSet[sImageType].arroPics[nNextImageIndex++];
                    }
                }
            });
            ma.oCurrentSet = oCurrentSet;
            responseTime = new Date();
        },
        AnswerSelected: function(oPic) {
            responseTime = new Date() - responseTime;
            ma.oCurrentPic = oPic;            
            ma.bShowNextButton = true;
        }
    }
    ma.Helper.Init();
}