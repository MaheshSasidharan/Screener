app.factory('Factory_DataService', ['$http', 'Factory_Constants', 'Factory_CommonRoutines', DataService])

function DataService($http, Constants, CommonFactory) {
    var Helper = {
        //app: "http://localhost:5000/",
        //app: "http://localhost:3000/",
        //app: "http://localhost:6001/",
        //app: "http://128.255.84.48:3001/",
        app: "https://128.255.84.48:3001/",
        Users: {
            controller: "users/",
            GetCurrentUsers: function() {
                return $http.get(Helper.app + Helper.Users.controller + 'test')
                    .then(
                        Helper.Miscellaneous.ReturnDataDotData,
                        Helper.Miscellaneous.FailedInService)
            }
        },
        Assessments: {
            controller: "assessments/",
            GetAssessments: function() {
                return $http.get(Helper.app + Helper.Assessments.controller + 'GetAssessments')
                    .then(
                        Helper.Miscellaneous.ReturnDataDotData,
                        Helper.Miscellaneous.FailedInService)
            },
            SaveAssessments: function(oSaveItem) {
                return $http.post(Helper.app + Helper.Assessments.controller + 'SaveAssessments', { oSaveItem: oSaveItem })
                    .then(
                        Helper.Miscellaneous.ReturnDataDotData,
                        Helper.Miscellaneous.FailedInService)
            },
            AudioUploadWord: function(oSaveItem) {
                return $http.post(Helper.app + Helper.Assessments.controller + 'AudioUploadWord', { oSaveItem: oSaveItem })
                    .then(
                        Helper.Miscellaneous.ReturnDataDotData,
                        Helper.Miscellaneous.FailedInService)
            },
            AudioUpload: function(oSaveItem) {
                return $http.post(Helper.app + Helper.Assessments.controller + 'AudioUpload', { oSaveItem: oSaveItem })
                    .then(
                        Helper.Miscellaneous.ReturnDataDotData,
                        Helper.Miscellaneous.FailedInService)
            },
            GetAudioAssessment: function(nAssmntNum) {
                return $http.get(Helper.app + Helper.Assessments.controller + 'GetAudioAssessment?nAssmntNum=' + nAssmntNum, { responseType: "blob" })
                    .then(
                        Helper.Miscellaneous.ReturnDataDotData,
                        Helper.Miscellaneous.FailedInService)
            },
            GetAudioAssessment: function(nAssmntNum) {
                return $http.get(Helper.app + Helper.Assessments.controller + 'GetAudioAssessment?nAssmntNum=' + nAssmntNum, { responseType: "arraybuffer" })
                    .then(
                        Helper.Miscellaneous.ReturnDataDotData,
                        Helper.Miscellaneous.FailedInService)
            },
            GetSourceAddress: function() {
                return Helper.app + Helper.Assessments.controller;
            },
            GetPicNamesMatrixAssessment: function() {
                return $http.get(Helper.app + Helper.Assessments.controller + 'GetPicNamesMatrixAssessment')
                    .then(
                        Helper.Miscellaneous.ReturnDataDotData,
                        Helper.Miscellaneous.FailedInService)
            }
        },
        Miscellaneous: {
            ReturnDataDotData: function(data) {
                return data.data;
            },
            FailedInService: function(err) {
                console.log(err);
                CommonFactory.Notification.error(Constants.Miscellaneous.SomethingWentWrong);
                return { status: false };
            }
        }
    }

    var oService = {
        GetCurrentUsers: Helper.Users.GetCurrentUsers,
        GetAssessments: Helper.Assessments.GetAssessments,
        SaveAssessments: Helper.Assessments.SaveAssessments,
        AudioUploadWord: Helper.Assessments.AudioUploadWord,
        AudioUpload: Helper.Assessments.AudioUpload,
        GetAudioAssessment: Helper.Assessments.GetAudioAssessment,
        GetSourceAddress: Helper.Assessments.GetSourceAddress,
        GetPicNamesMatrixAssessment: Helper.Assessments.GetPicNamesMatrixAssessment
    }
    return oService;
}