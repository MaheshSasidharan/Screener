app.factory('Factory_Constants', [Constants])

function Constants() {
    var oConstants = {
        Miscellaneous: {
            AssessmentCompleteNext: "You have completed this assessment. Click NEXT to continue.",
            SomethingWentWrong: "Sorry something went wrong"
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
                }]
            }
        },
        AudioAssessment: {
            audioRecordLength: 5, // seconds
            arrVoices: [
                '1_1',
                '1_2',
                //'1_3',
                // '2_1',
                // '2_2',
                // '2_3',
                // '3_1',
                // '3_2',
                // '3_3',
            ]
        },
        MatrixReasoning: {
            arrImages: [{
                sSetNum: "set1",
                oFrame: {
                    nWidth: 2,
                    nHeight: 3,
                    sSetType: "frameSets",
                    arrPicNames: [
                        "1_square.png",
                        "2_triangle.png",
                        "1_square.png",
                        "pentagon.png",
                        "questionmark.png",
                        "pentagon.png"
                    ]
                },
                oSolution: {
                    nWidth: 3,
                    nHeight: 2,
                    sSetType: "solutionSets",
                    arrPicNames: [
                        "circle.png",
                        "pentagon.png",
                        "1_square.png",
                        "2_triangle.png",
                        "circle.png",
                        "pentagon.png"
                    ]
                }
            }]
        }
    }
    return oConstants;
}
