app.factory('Factory_Constants', [Constants])

function Constants() {
    var oConstants = {
        Miscellaneous: {
            AssessmentCompleteNext: "You have completed this assessment. Click NEXT to continue.",
            SomethingWentWrong: "Sorry something went wrong",
            IsMobileDevice: "Sorry. For this assessment, we only support desktop/laptop. Please open the link on desktop/laptop, or you can provide your email address, to get a reminder for the same.",
            FailedMediaAccess: "Failed to get media access",
            NoBrowserSupport: "Your browser does not support features required to take this assessment. Please upgrade to the latest browser versions of your choice."
        },
        Assessments: {
            arrDropDowns: {
                Gender: [{
                    val: 'NoResponse',
                    label: 'Prefer not to say'
                }, {
                    val: 'Female',
                    label: 'Female'
                }, {
                    val: 'Male',
                    label: 'Male'
                }, {
                    val: 'Other',
                    label: 'Other'
                }],
                Ethnicity: [{
                    val: 'NoResponse',
                    label: 'Prefer not to say'
                }, {
                    val: 'AmericanIndian',
                    label: 'American Indian/Alaska Native'
                }, {
                    val: 'Asian',
                    label: 'Asian'
                }, {
                    val: 'AfricanAmerican',
                    label: 'Black/African American'
                }, {
                    val: 'Hispanic',
                    label: 'Hispanic/Latino'
                }, {
                    val: 'NativeHawaiian',
                    label: 'Native Hawaiian/Other Pacific Islander'
                }, {
                    val: 'White',
                    label: 'White (Not Hispanic or Latino)'
                }],
                Education: [{
                    val: 'NoHighSchool',
                    label: 'Did no graduate High School'
                }, {
                    val: 'HighSchool',
                    label: 'High School diploma or Equivalent'
                }, {
                    val: 'College',
                    label: 'College'
                }, {
                    val: '2YearCollege',
                    label: '2 year college degree'
                }, {
                    val: '4YearCollege',
                    label: '4 year college degree'
                }, {
                    val: 'Graduate',
                    label: 'Graduate'
                }, {
                    val: 'PostGraduate',
                    label: 'Post Graduate'
                }],
                MusicalAbility: [{
                    val: 'NoTraining',
                    label: 'I have never had any formal training in any kind of music'
                }, {
                    val: 'SomeTraining',
                    label: 'I have some musical training but don’t routinely play or sing'
                }, {
                    val: 'FormalTraining',
                    label: 'I can play an instrument, or have formal training in singing'
                }, {
                    val: 'SingProfessionally',
                    label: 'I play or sing professionally'
                }, {
                    val: 'MusicMajor',
                    label: 'I study music as a major'
                }, {
                    val: 'TeachMusic',
                    label: 'I teach music'
                }]
            }
        },
        MetronomeAssessment: {
            totalClicks: 20
        },
        AudioAssessment: {
            arrVoices: [{
                    Prefix: '1_0',
                    RecordLength: 8
                }, {
                    Prefix: '1_1',
                    RecordLength: 3
                },
                //'1_0',
                //'1_1',
                //'1_2',
                //'1_3',
                // '2_1',
                // '2_2',
                // '2_3',
                // '3_1',
                // '3_2',
                // '3_3',
            ]
        },
        SyncVoiceAssessment: {
            audioRecordLength: 3, //10, // seconds
            arrVoices: [
                '1_0',
                '1_1',
                //'1_2',
                //'1_3',
                // '2_1',
                // '2_2',
                // '2_3',
                // '3_1',
                // '3_2',
                // '3_3',
            ]
        },
        PicturePromptAssessment: {
            audioRecordLength: 3, //30,
        },
        VoiceAssessment: {
            arrCharacters: [{
                Char: 'A',
                RecordLength: 30
            }, {
                Char: 'B',
                RecordLength: 7
            }, {
                Char: 'C',
                RecordLength: 1
            }]
        }
    }
    return oConstants;
}
