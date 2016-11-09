INSERT INTO Users (ip, sessionId) VALUES ('http://127.0.0.1:8000', '1234-1234-1234-1234');

INSERT INTO Assessments (sequence, nickName, name, description) VALUES (1, 'text', 'Basic Information', 'This is used to collect basic non-identifiable information from the user'),(2, 'matrixReasoning', 'Matrix Reasoning', 'Here you will try to select an image that you feel will best fit the matrix.'),(3, 'audioWords', 'Audio Assessment', 'Here we collect your voice sample'),(4, 'voice', 'Voice Assessment', 'Get voice of participant'),(5, 'video', 'Video Assessment', 'Here we collect your video');

INSERT INTO Questions (question, assessmentId) VALUES ('Provide your Date of Birth.', 1), ('What is your Gender?', 1),('Select your Ethnicity', 1),('Select your highest education', 1);
INSERT INTO Questions (question, assessmentId) VALUES ('In this assessment, you will select an image that you feel best fits a matrix of images', 2);
INSERT INTO Questions (question, assessmentId) VALUES ('Here you will listen to some audio clips. You will have to listen to the audio and repeat what you heard. Click Start to start this assessment.', 3);
INSERT INTO Questions (question, assessmentId) VALUES ('You will be provided with a letter. Please say as many words as you can starting with the letter. Click on Start Recording whenever you are ready. You will be given a 3 second countdown after which you can start saying the words.', 4);
#INSERT INTO Questions (question, assessmentId) VALUES ('And then first question 1 for assessment 3', 3), ('Second for assessment 3', 3);

#INSERT INTO ResponseTexts(userId, questionId, response) VALUES(1, 1, 'My First response'), (1, 2, 'My Second response'), (1, 3, 'This is response for 2nd assessment'), (1, 4, 'And same for question 2 for 2nd assessment'), (1, 5, 'Third assessment, question1 response'), (1, 6, 'Finally, 3rd assessment, question 2 response')

