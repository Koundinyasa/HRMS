/*
  20261105_create_chatbot_drafts.sql

  Chatbot conversation drafts (a leave being applied, a cancel choice, a team
  or directory list in progress). The backend keeps them in memory and writes
  every change here too, so an open conversation survives a server restart.
  Rows older than 30 minutes are ignored and removed when the server starts.

  Used by src/chatbot/services/draft.service.ts and
  src/db/hrms-db.service.ts (saveChatbotDraft and related).

  Safe to run more than once. If the table is missing the chatbot still works,
  the drafts then live in memory only.
*/
SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

IF OBJECT_ID(N'dbo.ChatbotDrafts', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[ChatbotDrafts](
        [EmployeeID] [varchar](100) NOT NULL,
        [DraftType]  [varchar](40)  NOT NULL,
        [Payload]    [nvarchar](max) NOT NULL,
        [SavedAtMs]  [bigint]       NOT NULL,
        CONSTRAINT PK_ChatbotDrafts PRIMARY KEY CLUSTERED (EmployeeID, DraftType)
    )
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_ChatbotDrafts_SavedAtMs' AND object_id = OBJECT_ID(N'dbo.ChatbotDrafts'))
    CREATE NONCLUSTERED INDEX IX_ChatbotDrafts_SavedAtMs ON [dbo].[ChatbotDrafts] ([SavedAtMs]);
GO
