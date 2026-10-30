import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { DbModule } from '../db/db.module';
import { AuthModule } from '../auth/auth.module';

import { DraftService } from './services/draft.service';
import { ChatbotSessionCleaner } from './services/session-cleaner.service';
import { ParserService } from './services/parser.service';
import { MenuService } from './services/menu.service';
import { CompanyService } from './services/company.service';
import { EmployeeService } from './services/employee.service';
import { AiService } from './services/ai.service';
import { LeaveService } from './services/leave.service';
import { ResponseService } from './services/response.service';
import { TeamService } from './services/team.service';
import { ReportService } from './services/report.service';
import { LeaveApiService } from './services/leave-api.service';
import { LeaveModule } from '../employee/leave/leave.module';

@Module({
  // One direction only: the chatbot uses AuthModule. AuthModule does not know
  // about the chatbot; it announces login/logout (SessionBoundaryEvents) and
  // ChatbotSessionCleaner listens.
  // LeaveModule: the chatbot calls the employee leave service directly.
  imports: [DbModule, AuthModule, LeaveModule],
  controllers: [ChatbotController],
  providers: [
    ChatbotService,
    DraftService,
    ChatbotSessionCleaner,
    ParserService,
    MenuService,
    CompanyService,
    EmployeeService,
    AiService,
    LeaveService,
    ResponseService,
    TeamService,
    ReportService,
    LeaveApiService,
  ],
  exports: [DraftService],
})
export class ChatbotModule {}
