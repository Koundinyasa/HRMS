import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './services/chatbot.service';
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

@Module({
  imports: [DbModule, AuthModule],
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
  ],
})
export class ChatbotModule {}
