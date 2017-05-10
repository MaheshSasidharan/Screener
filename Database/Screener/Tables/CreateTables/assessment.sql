CREATE TABLE Assessments (
	assessmentId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	name varchar(50) NOT NULL,
	nickName varchar(20) NOT NULL,
	description TEXT NOT NULL,
	active BIT(1) NOT NULL,
	sequence int not null,
	reg_date TIMESTAMP
)
