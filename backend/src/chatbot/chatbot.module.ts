import { forwardRef, Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { DbModule } from '../db/db.module';
import { AuthModule } from '../auth/auth.module';

import { DraftService } from './services/draft.service';
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
import { HttpModule } from '@nestjs/axios';

@Module({
  // forwardRef here + the matching forwardRef in AuthModule is what lets
  // these two modules depend on each other (Auth needs DraftService from
  // here; this module already needs AuthModule) without NestJS treating it
  // as an unresolvable circular dependency.
  imports: [DbModule, forwardRef(() => AuthModule), HttpModule],
  controllers: [ChatbotController],
  providers: [
    ChatbotService,
    DraftService,
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
  // Exported so AuthService can inject the *same* DraftService instance —
  // without this, AuthModule would only ever be able to see a separate,
  // empty copy, and clearing drafts there would do nothing to the real
  // chatbot's state.
  exports: [DraftService],
})
export class ChatbotModule {}
