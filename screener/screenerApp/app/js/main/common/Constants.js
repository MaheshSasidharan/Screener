app.factory('Factory_Constants', [Constants])

function Constants() {
    var oConstants = {
        Miscellaneous: {
            AssessmentCompleteNext: "You have completed this assessment. Click NEXT to continue.",
            SomethingWentWrong: "Sorry something went wrong",
            IsMobileDevice: "Sorry, for this assessment, we only support desktop/laptop. Please open the link on your desktop/laptop, or you can provide your email address to get a reminder.",
            FailedMediaAccess: "Failed to get media access",
            NoBrowserSupport: "Your browser does not support features required to take this assessment. Please upgrade to the latest browser versions of your choice."
        },
        Assessments: {
            ProgressStartDelay: 200,
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
                }],
                PublicSchool: [{
                    val: 'Elementary',
                    label: 'Elementary school (all or partial)',
                    selected: false
                }, {
                    val: 'Middle',
                    label: 'Middle school/Jr. High (all or partial)',
                    selected: false
                }, {
                    val: 'High',
                    label: 'High school (all or partial)',
                    selected: false
                }],
                States: [
                    { val: 'Alabama', label: 'Alabama' }, { val: 'Alaska', label: 'Alaska' }, { val: 'Arizona', label: 'Arizona' }, { val: 'Arkansas', label: 'Arkansas' }, { val: 'California', label: 'California' }, { val: 'Colorado', label: 'Colorado' }, { val: 'Connecticut', label: 'Connecticut' }, { val: 'Delaware', label: 'Delaware' }, { val: 'Florida', label: 'Florida' }, { val: 'Georgia', label: 'Georgia' }, { val: 'Hawaii', label: 'Hawaii' }, { val: 'Idaho', label: 'Idaho' }, { val: 'Illinois', label: 'Illinois' }, { val: 'Indiana', label: 'Indiana' }, { val: 'Iowa', label: 'Iowa' }, { val: 'Kansas', label: 'Kansas' }, { val: 'Kentucky', label: 'Kentucky' }, { val: 'Louisiana', label: 'Louisiana' }, { val: 'Maine', label: 'Maine' }, { val: 'Maryland', label: 'Maryland' }, { val: 'Massachusetts', label: 'Massachusetts' }, { val: 'Michigan', label: 'Michigan' }, { val: 'Minnesota', label: 'Minnesota' }, { val: 'Mississippi', label: 'Mississippi' }, { val: 'Missouri', label: 'Missouri' }, { val: 'Montana', label: 'Montana' }, { val: 'Nebraska', label: 'Nebraska' }, { val: 'Nevada', label: 'Nevada' }, { val: 'New', label: 'New' }, { val: 'Hampshire', label: 'Hampshire' }, { val: 'New', label: 'New' }, { val: 'Jersey', label: 'Jersey' }, { val: 'New', label: 'New' }, { val: 'Mexico', label: 'Mexico' }, { val: 'New', label: 'New' }, { val: 'York', label: 'York' }, { val: 'North', label: 'North' }, { val: 'Carolina', label: 'Carolina' }, { val: 'North', label: 'North' }, { val: 'Dakota', label: 'Dakota' }, { val: 'Ohio', label: 'Ohio' }, { val: 'Oklahoma', label: 'Oklahoma' }, { val: 'Oregon', label: 'Oregon' }, { val: 'Pennsylvania', label: 'Pennsylvania' }, { val: 'Rhode_Island', label: 'Rhode_Island' }, { val: 'South', label: 'South' }, { val: 'Carolina', label: 'Carolina' }, { val: 'South', label: 'South' }, { val: 'Dakota', label: 'Dakota' }, { val: 'Tennessee', label: 'Tennessee' }, { val: 'Texas', label: 'Texas' }, { val: 'Utah', label: 'Utah' }, { val: 'Vermont', label: 'Vermont' }, { val: 'Virginia', label: 'Virginia' }, { val: 'Washington', label: 'Washington' }, { val: 'West', label: 'West' }, { val: 'Virginia', label: 'Virginia' }, { val: 'Wisconsin', label: 'Wisconsin' }, { val: 'Wyoming', label: 'Wyoming' }
                ],
                YesNo: [{
                    val: 'Yes',
                    label: 'Yes'
                }, {
                    val: 'No',
                    label: 'No'
                }]
            }
        },
        Home: {
            AssessmentCompleted: "Thank you. You have completed the Assessment.",
            EmailSaved: "Thank you. We will send you a reminder on the provided email address"
        },
        TimeDurationAssessment: {
            arrTimeDurations: [
                5,
                1.5,
                0.5,
                11,
                5
            ],
            // arrTimeDurations: [
            //     5,
            //     1.5
            // ]            
        },
        MetronomeAssessment: {
            totalClicks: 20
        },
        AudioAssessment: {
            arrVoices: [{
                Prefix: '1_0',
                RecordLength: 4
            }, {
                Prefix: '1_1',
                RecordLength: 3
            }, {
                Prefix: '1_2',
                RecordLength: 2
            }, {
                Prefix: '1_3',
                RecordLength: 3
            }, {
                Prefix: '1_4',
                RecordLength: 3
            }, {
                Prefix: '1_5',
                RecordLength: 3
            }, {
                Prefix: '1_6',
                RecordLength: 4
            }, {
                Prefix: '1_7',
                RecordLength: 4
            }, {
                Prefix: '1_8',
                RecordLength: 4
            }, {
                Prefix: '1_9',
                RecordLength: 4
            }, {
                Prefix: '1_10',
                RecordLength: 4
            }, {
                Prefix: '1_11',
                RecordLength: 3
            }, {
                Prefix: '1_12',
                RecordLength: 4
            }, {
                Prefix: '1_13',
                RecordLength: 4
            }, {
                Prefix: '1_14',
                RecordLength: 4
            }, {
                Prefix: '1_15',
                RecordLength: 4
            }, {
                Prefix: '1_16',
                RecordLength: 4
            }, {
                Prefix: '1_17',
                RecordLength: 4
            }, {
                Prefix: '1_18',
                RecordLength: 5
            }, {
                Prefix: '1_19',
                RecordLength: 5
            }, {
                Prefix: '1_20',
                RecordLength: 5
            }, {
                Prefix: '1_21',
                RecordLength: 5
            }, {
                Prefix: '1_22',
                RecordLength: 5
            }, {
                Prefix: '1_23',
                RecordLength: 5
            }, {
                Prefix: '1_24',
                RecordLength: 5
            }]
        },
        SyncVoiceAssessment: {
            audioRecordLength: 8, //3, //10, // seconds
            arrVoices: [
                '1_0',
                '1_1',
                '1_2',
                '1_3',
                // '2_1',
                // '2_2',
                // '2_3',
                // '3_1',
                // '3_2',
                // '3_3',
            ]
        },
        PicturePromptAssessment: {
            audioRecordLength: 30,
        },
        VoiceAssessment: {
            arrCharacters: [{
                Char: 'A',
                RecordLength: 30
            }, {
                Char: 'B',
                RecordLength: 30
            }, {
                Char: 'C',
                RecordLength: 30
            }]
        },
        PersonalAssessment: {
            EnterEmail: "Please enter your email address and click DONE"
        }
    }
    return oConstants;
}
