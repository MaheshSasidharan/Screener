app.factory('Factory_DataService', ['$http', 'Factory_Constants', 'Factory_CommonRoutines', DataService])

function DataService($http, Constants, CommonFactory) {
    var Helper = {
        //app: "http://localhost:5000/",
        //app: "http://localhost:3000/",
        //app: "http://localhost:6001/",
        //app: "http://128.255.84.48:3001/",
        /* #ServerAddress */
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
            SaveUserSource:  function(sUserSource) {
                return $http.post(Helper.app + Helper.Assessments.controller + 'SaveUserSource', { sUserSource: sUserSource })
                    .then(
                        Helper.Miscellaneous.ReturnDataDotData,
                        Helper.Miscellaneous.FailedInService)
            },
            GetAssessments: function() {
                return $http.get(Helper.app + Helper.Assessments.controller + 'GetAssessments')
                    .then(
                        Helper.Miscellaneous.ReturnDataDotData,
                        Helper.Miscellaneous.FailedInService)
            },
            GetAssessmentAudioInstruction: function(nAssmntNum) {
                return $http.get(Helper.app + Helper.Assessments.controller + 'GetAssessmentAudioInstruction?nAssmntNum=' + nAssmntNum, { responseType: "arraybuffer" })
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
            ReadingUpload: function(oSaveItem) {
                return $http.post(Helper.app + Helper.Assessments.controller + 'ReadingUpload', { oSaveItem: oSaveItem })
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
            GetMetronomeClickAssessment: function(nAssmntNum) {
                return $http.get(Helper.app + Helper.Assessments.controller + 'GetMetronomeClickAssessment?nAssmntNum=' + nAssmntNum, { responseType: "arraybuffer" })
                    .then(
                        Helper.Miscellaneous.ReturnDataDotData,
                        Helper.Miscellaneous.FailedInService)
            },
            GetSyncVoiceAssessment: function(nAssmntNum) {
                return $http.get(Helper.app + Helper.Assessments.controller + 'GetSyncVoiceAssessment?nAssmntNum=' + nAssmntNum, { responseType: "arraybuffer" })
                    .then(
                        Helper.Miscellaneous.ReturnDataDotData,
                        Helper.Miscellaneous.FailedInService)
            },
            AudioSyncVoiceUpload: function(oSaveItem) {
                return $http.post(Helper.app + Helper.Assessments.controller + 'AudioSyncVoiceUpload', { oSaveItem: oSaveItem })
                    .then(
                        Helper.Miscellaneous.ReturnDataDotData,
                        Helper.Miscellaneous.FailedInService)
            },
            AudioPicturePromptVoiceUpload: function(oSaveItem) {
                return $http.post(Helper.app + Helper.Assessments.controller + 'AudioPicturePromptVoiceUpload', { oSaveItem: oSaveItem })
                    .then(
                        Helper.Miscellaneous.ReturnDataDotData,
                        Helper.Miscellaneous.FailedInService)
            },
            GetSourceAddress: function() {
                return Helper.app + Helper.Assessments.controller;
            },
            GetPicNamesMatrixAssessment: function(sAssessmentType) {
                return $http.get(Helper.app + Helper.Assessments.controller + 'GetPicNamesMatrixAssessment?sAssessmentType=' + sAssessmentType)
                    .then(
                        Helper.Miscellaneous.ReturnDataDotData,
                        Helper.Miscellaneous.FailedInService)
            },
            GetPicNamesPicturePrompt: function() {
                return $http.get(Helper.app + Helper.Assessments.controller + 'GetPicNamesPicturePrompt')
                    .then(
                        Helper.Miscellaneous.ReturnDataDotData,
                        Helper.Miscellaneous.FailedInService)
            },
            GetSetupAudio: function(nAssmntNum) {
                return $http.get(Helper.app + Helper.Assessments.controller + 'GetSetupAudio?nAssmntNum=' + nAssmntNum, { responseType: "arraybuffer" })
                    .then(
                        Helper.Miscellaneous.ReturnDataDotData,
                        Helper.Miscellaneous.FailedInService)
            },
        },
        Miscellaneous: {
            ReturnDataDotData: function(data) {
                return data.data;
            },
            FailedInService: function(err) {
                console.log(err);
                CommonFactory.Notification.error(Constants.Miscellaneous.SomethingWentWrong);
                return { status: false };
            },
            bAssessmentsCompleted: false,
            isMobileDevice: false,
            oSetUpIssues: {
                bHasMicrophoneIssue: false,
                bHasSpeakerIssue: false,
                bHasSetupIssue: function() {
                    return (this.bHasMicrophoneIssue || this.bHasSpeakerIssue);
                }
            },
            oAudioContext: null,
            CreateOrGetContext: function() {
                if (this.oAudioContext) {
                    return this.oAudioContext;
                }
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                this.oAudioContext = new AudioContext();
                return this.oAudioContext
            }
        }
    }

    var oService = {
        SaveUserSource: Helper.Assessments.SaveUserSource,
        GetCurrentUsers: Helper.Users.GetCurrentUsers,
        GetAssessments: Helper.Assessments.GetAssessments,
        GetAssessmentAudioInstruction: Helper.Assessments.GetAssessmentAudioInstruction,
        SaveAssessments: Helper.Assessments.SaveAssessments,
        AudioUploadWord: Helper.Assessments.AudioUploadWord,
        AudioUpload: Helper.Assessments.AudioUpload,
        GetAudioAssessment: Helper.Assessments.GetAudioAssessment,
        GetMetronomeClickAssessment: Helper.Assessments.GetMetronomeClickAssessment,
        GetSyncVoiceAssessment: Helper.Assessments.GetSyncVoiceAssessment,
        AudioSyncVoiceUpload: Helper.Assessments.AudioSyncVoiceUpload,
        AudioPicturePromptVoiceUpload: Helper.Assessments.AudioPicturePromptVoiceUpload,
        GetSourceAddress: Helper.Assessments.GetSourceAddress,
        GetPicNamesMatrixAssessment: Helper.Assessments.GetPicNamesMatrixAssessment,
        GetPicNamesPicturePrompt: Helper.Assessments.GetPicNamesPicturePrompt,
        ReadingUpload: Helper.Assessments.ReadingUpload,
        GetSetupAudio: Helper.Assessments.GetSetupAudio,        
        bAssessmentsCompleted: Helper.Miscellaneous.bAssessmentsCompleted,
        isMobileDevice: Helper.Miscellaneous.isMobileDevice,
        oSetUpIssues: Helper.Miscellaneous.oSetUpIssues,
        oAudioContext: Helper.Miscellaneous.oAudioContext,
        CreateOrGetContext: Helper.Miscellaneous.CreateOrGetContext
    }
    return oService;
}
