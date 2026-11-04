IF OBJECT_ID('dbo.RecruitmentInterviewRounds', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.RecruitmentInterviewRounds (
    ID BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    ApplicationID INT NOT NULL,
    RoundName NVARCHAR(80) NOT NULL,
    ScheduledAt DATETIME2(0) NOT NULL,
    DurationMinutes SMALLINT NOT NULL,
    Mode VARCHAR(20) NOT NULL
      CONSTRAINT DF_RecruitmentInterviewRounds_Mode DEFAULT ('video'),
    LocationOrLink NVARCHAR(300) NULL,
    Status VARCHAR(20) NOT NULL
      CONSTRAINT DF_RecruitmentInterviewRounds_Status DEFAULT ('scheduled'),
    StatusNote NVARCHAR(500) NULL,
    CreatedBy VARCHAR(25) NOT NULL,
    CreatedAt DATETIME2(0) NOT NULL
      CONSTRAINT DF_RecruitmentInterviewRounds_CreatedAt DEFAULT (SYSDATETIME()),
    CompletedAt DATETIME2(0) NULL,
    CONSTRAINT CK_RecruitmentInterviewRounds_Duration
      CHECK (DurationMinutes BETWEEN 15 AND 480),
    CONSTRAINT CK_RecruitmentInterviewRounds_Mode
      CHECK (Mode IN ('video', 'in_person', 'phone')),
    CONSTRAINT CK_RecruitmentInterviewRounds_Status
      CHECK (Status IN ('scheduled', 'completed', 'no_show', 'cancelled'))
  );

  CREATE INDEX IX_RecruitmentInterviewRounds_Application_ScheduledAt
    ON dbo.RecruitmentInterviewRounds (ApplicationID, ScheduledAt);
  CREATE INDEX IX_RecruitmentInterviewRounds_Status_ScheduledAt
    ON dbo.RecruitmentInterviewRounds (Status, ScheduledAt);
END;

IF OBJECT_ID('dbo.RecruitmentInterviewPanel', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.RecruitmentInterviewPanel (
    InterviewID BIGINT NOT NULL,
    EmployeeID VARCHAR(25) NOT NULL,
    CONSTRAINT PK_RecruitmentInterviewPanel
      PRIMARY KEY (InterviewID, EmployeeID),
    CONSTRAINT FK_RecruitmentInterviewPanel_Interview
      FOREIGN KEY (InterviewID)
      REFERENCES dbo.RecruitmentInterviewRounds (ID)
      ON DELETE CASCADE
  );

  CREATE INDEX IX_RecruitmentInterviewPanel_Employee
    ON dbo.RecruitmentInterviewPanel (EmployeeID, InterviewID);
END;

IF OBJECT_ID('dbo.RecruitmentInterviewFeedback', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.RecruitmentInterviewFeedback (
    ID BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    InterviewID BIGINT NOT NULL,
    EmployeeID VARCHAR(25) NOT NULL,
    Rating DECIMAL(3,1) NOT NULL,
    Recommendation VARCHAR(20) NOT NULL,
    Feedback NVARCHAR(4000) NOT NULL,
    Strengths NVARCHAR(2000) NULL,
    Concerns NVARCHAR(2000) NULL,
    SubmittedAt DATETIME2(0) NOT NULL
      CONSTRAINT DF_RecruitmentInterviewFeedback_SubmittedAt DEFAULT (SYSDATETIME()),
    CONSTRAINT UQ_RecruitmentInterviewFeedback_Interview_Employee
      UNIQUE (InterviewID, EmployeeID),
    CONSTRAINT FK_RecruitmentInterviewFeedback_Interview
      FOREIGN KEY (InterviewID)
      REFERENCES dbo.RecruitmentInterviewRounds (ID)
      ON DELETE CASCADE,
    CONSTRAINT CK_RecruitmentInterviewFeedback_Rating
      CHECK (Rating BETWEEN 0 AND 5 AND Rating * 2 = FLOOR(Rating * 2)),
    CONSTRAINT CK_RecruitmentInterviewFeedback_Recommendation
      CHECK (Recommendation IN ('strong_hire', 'hire', 'hold', 'no_hire'))
  );
END;
