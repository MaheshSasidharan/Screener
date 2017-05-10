app.factory('Factory_Constants', [Constants])

function Constants() {
    var oConstants = {
        Miscellaneous: {
            AssessmentCompleteNext: "You have completed this assessment. Click NEXT to continue.",
            SomethingWentWrong: "Sorry, something went wrong",
            IsMobileDevice: "Sorry, for this assessment, we only support desktop/laptop. Please open the link on your desktop/laptop, or you can provide your email address to get a reminder for when you have access to a desktop or laptop.",
            bHasMicrophoneIssue: "Sorry, for this assessment, we need to ensure you have a functioning microphone. Please test this from another desktop/laptop, or you can provide your email address to get a reminder.",
            bHasSpeakerIssue: "Sorry, for this assessment, we need to ensure you have a functioning speaker or headphones. Please test this from another desktop/laptop, or you can provide your email address to get a reminder.",
            FailedMediaAccess: "Failed to get media access",
            NoBrowserSupport: "Your browser does not support features required to take this assessment. Please upgrade to the latest browser versions of your choice."
        },
        Assessments: {
            ProgressStartDelay: 200,
            nBufferRecordLength: 1,
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
                    label: 'I play or sing professionally / I study music as a major / I teach music'
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
                    { val: 'Alabama', label: 'Alabama' }, { val: 'Alaska', label: 'Alaska' }, { val: 'Arizona', label: 'Arizona' }, { val: 'Arkansas', label: 'Arkansas' }, { val: 'California', label: 'California' }, { val: 'Colorado', label: 'Colorado' }, { val: 'Connecticut', label: 'Connecticut' }, { val: 'Delaware', label: 'Delaware' }, { val: 'Florida', label: 'Florida' }, { val: 'Georgia', label: 'Georgia' }, { val: 'Hawaii', label: 'Hawaii' }, { val: 'Idaho', label: 'Idaho' }, { val: 'Illinois', label: 'Illinois' }, { val: 'Indiana', label: 'Indiana' }, { val: 'Iowa', label: 'Iowa' }, { val: 'Kansas', label: 'Kansas' }, { val: 'Kentucky', label: 'Kentucky' }, { val: 'Louisiana', label: 'Louisiana' }, { val: 'Maine', label: 'Maine' }, { val: 'Maryland', label: 'Maryland' }, { val: 'Massachusetts', label: 'Massachusetts' }, { val: 'Michigan', label: 'Michigan' }, { val: 'Minnesota', label: 'Minnesota' }, { val: 'Mississippi', label: 'Mississippi' }, { val: 'Missouri', label: 'Missouri' }, { val: 'Montana', label: 'Montana' }, { val: 'Nebraska', label: 'Nebraska' }, { val: 'Nevada', label: 'Nevada' }, { val: 'NewHampshire', label: 'New Hampshire' }, { val: 'NewJersey', label: 'New Jersey' }, { val: 'NewMexico', label: 'New Mexico' }, { val: 'NewYork', label: 'New York' }, { val: 'NorthCarolina', label: 'North Carolina' }, { val: 'NorthDakota', label: 'North Dakota' }, { val: 'Ohio', label: 'Ohio' }, { val: 'Oklahoma', label: 'Oklahoma' }, { val: 'Oregon', label: 'Oregon' }, { val: 'Pennsylvania', label: 'Pennsylvania' }, { val: 'RhodeIsland', label: 'Rhode Island' }, { val: 'SouthCarolina', label: 'South Carolina' }, { val: 'SouthDakota', label: 'South Dakota' }, { val: 'Tennessee', label: 'Tennessee' }, { val: 'Texas', label: 'Texas' }, { val: 'Utah', label: 'Utah' }, { val: 'Vermont', label: 'Vermont' }, { val: 'Virginia', label: 'Virginia' }, { val: 'Washington', label: 'Washington' }, { val: 'WestVirginia', label: 'West Virginia' }, { val: 'Wisconsin', label: 'Wisconsin' }, { val: 'Wyoming', label: 'Wyoming' }
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
            AssessmentCompleted: "Thank you. You have completed the assessment.",
            EmailSaved: "Thank you. We will send you a reminder at the provided email address."
        },
        TimeDurationAssessment: {
            arrTimeDurations: [
                5,
                1.5,
                0.5,
                11,
                5,
                1,
                7,
                0.75
            ],
            // arrTimeDurations: [
            //     5,
            //     1.5
            // ]            
        },
        MatrixAssessment: {
            sAssessmentType: "matrixPics"
        },
        RecollectPic1: {
            sAssessmentType: "recollectPic1",
            nDisplaySeconds: 10,
        },
        RecollectPic2: {
            sAssessmentType: "recollectPic2",
            nDisplaySeconds: 30,
        },
        MetronomeAssessment: {
            totalClicks: 20,
            arrVoices: [
                '1_0',
                '1_1',
                '1_2'
            ]
        },
        AudioAssessment: {
            arrVoices: [{
                    Prefix: '1_1',
                    RecordLength: 2
                }, {
                    Prefix: '1_2',
                    RecordLength: 2
                },
                /*
                {
                    Prefix: '1_3',
                    RecordLength: 2
                }, {
                    Prefix: '1_4',
                    RecordLength: 2
                }, {
                    Prefix: '1_5',
                    RecordLength: 3
                }, {
                    Prefix: '1_6',
                    RecordLength: 3
                }, {
                    Prefix: '1_7',
                    RecordLength: 3
                }, 
                */
                {
                    Prefix: '1_8',
                    RecordLength: 4
                },
                /* {
                    Prefix: '1_9',
                    RecordLength: 3
                }, {
                    Prefix: '1_10',
                    RecordLength: 4
                }, 

                */
                {
                    Prefix: '1_11',
                    RecordLength: 3
                },
                /*{
                    Prefix: '1_12',
                    RecordLength: 3
                }, {
                    Prefix: '1_13',
                    RecordLength: 4
                }, {
                    Prefix: '1_14',
                    RecordLength: 4
                }, 
                */
                {
                    Prefix: '1_15',
                    RecordLength: 3
                },
                /*{
                    Prefix: '1_16',
                    RecordLength: 4
                }, {
                    Prefix: '1_17',
                    RecordLength: 4
                }, {
                    Prefix: '1_18',
                    RecordLength: 4
                }, 
                */
                {
                    Prefix: '1_19',
                    RecordLength: 4
                },
                /*{
                    Prefix: '1_20',
                    RecordLength: 4
                }, {
                    Prefix: '1_21',
                    RecordLength: 5
                }, {
                    Prefix: '1_22',
                    RecordLength: 5
                }, 
                */
                {
                    Prefix: '1_23',
                    RecordLength: 5
                }, {
                    Prefix: '1_24',
                    RecordLength: 5
                }, {
                    Prefix: '1_25',
                    RecordLength: 8
                },
                /* {
                    Prefix: '1_26',
                    RecordLength: 8
                }, 
                */
                {
                    Prefix: '1_27',
                    RecordLength: 7
                },
                /*{
                    Prefix: '1_28',
                    RecordLength: 8
                }
                */
            ]
        },
        SyncVoiceAssessment: {
            audioRecordLength: 8, //3, //10, // seconds
            arrVoices: [
                '1_0',
                '1_1',
                '1_2',
                '1_3',
                '1_2',
                '1_1',
                // '2_1',
                // '2_2',
                // '2_3',
                // '3_1',
                // '3_2',
                // '3_3',
            ]
        },
        Setup: {
            audioRecordLength: 8,
            arrVoices: [
                'setup_audio'
            ],
            ButtonStatus: {
                GetStarted: "Let's get started",
                CheckMicrophone: "Click to check your microphone",
                CheckSpeakerFirst: "Great. Now let's check your speakers",
                CheckSpeaker: "Click to check your speakers",
                NotWorkingMicrophone: "Microphone not working. Try again by clicking here",
                NotWorkingMicrophoneNotification: "Your microphone is not working. :(",
                NotWorkingSpeaker: "Speaker not working. Try again by clicking here",
                NotWorkingSpeakerNotification: "Your speaker is not working. :(",
                StartAssessment: "Great. You are ready to start the assessment",
            }
        },
        PicturePromptAssessment: {
            audioRecordLength: 30,
        },
        VoiceAssessment: {
            arrCharacters: [{
                Char: 'A',
                RecordLength: 30,
                arrChars: ['R', 'D', 'A', 'M', 'B', 'P', 'C', 'S'],
                sType: "Most Frequent"
            }, {
                Char: 'B',
                RecordLength: 30,
                arrChars: ['L', 'G', 'I', 'H', 'E', 'F', 'T'],
                sType: "Medium Frequency"
            }, {
                Char: 'C',
                RecordLength: 30,
                arrChars: ['K', 'J', 'V', 'U', 'N', 'O', 'W'],
                sType: "Least Frequent"
            }]
        },
        PersonalAssessment: {
            EnterEmail: "Please enter your email address and click DONE"
        },
        ReadingAssessment: {
            arrParagraphs: [{
                sParagraph: 'Again Hal’s whip fell upon the dogs. They threw themselves against the breast-bands, dug their feet into the packed snow, got down low to it, and put forth all their strength. The sled held as though it were an anchor. After two efforts, they stood still, panting. The whip was whistling savagely, when once more Mercedes interfered. She dropped on her knees before Buck, with tears in her eyes, and put her arms around his neck. \n \n “You poor, poor dears,” she cried sympathetically, “why don’t you pull hard?—then you wouldn’t be whipped.” Buck did not like her, but he was feeling too miserable to resist her, taking it as part of the day’s miserable work.',
                RecordLength: 120,
                sParagraphType: 'Normal',
                sInstruction: 'Click on Start and read the text'
            }, {
                sParagraph: 'Again Hal’s whip fell upon the dogs. They threw themselves against the breast-bands, dug their feet into the packed snow, got down low to it, and put forth all their strength. The sled held as though it were an anchor. After two efforts, they stood still, panting. The whip was whistling savagely, when once more Mercedes interfered. She dropped on her knees before Buck, with tears in her eyes, and put her arms around his neck. \n \n “You poor, poor dears,” she cried sympathetically, “why don’t you pull hard?—then you wouldn’t be whipped.” Buck did not like her, but he was feeling too miserable to resist her, taking it as part of the day’s miserable work.',
                RecordLength: 120,
                sParagraphType: 'NoEmotion',
                sInstruction: 'Now, read the same text again, but this time, read it without any feeling: flat and without emotion'
            }, {
                sParagraph: 'Again Hal’s whip fell upon the dogs. They threw themselves against the breast-bands, dug their feet into the packed snow, got down low to it, and put forth all their strength. The sled held as though it were an anchor. After two efforts, they stood still, panting. The whip was whistling savagely, when once more Mercedes interfered. She dropped on her knees before Buck, with tears in her eyes, and put her arms around his neck. \n \n “You poor, poor dears,” she cried sympathetically, “why don’t you pull hard?—then you wouldn’t be whipped.” Buck did not like her, but he was feeling too miserable to resist her, taking it as part of the day’s miserable work.',
                RecordLength: 120,
                sParagraphType: 'WithEmotion',
                sInstruction: 'Finally, read the same text again, but read the narration and dialog with the appropriate level of feeling and emotion. Read for an audience, as if you’re telling a story.'
            }]
        }
    }
    return oConstants;
}
