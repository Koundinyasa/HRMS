import { Module } from '@nestjs/common';

import { HelpDeskController } from './admincenter.ess.helpdesk.controller';
import { HelpDeskService } from './admincenter.ess.helpdesk.service';

@Module({
  controllers: [HelpDeskController],
  providers: [HelpDeskService],
  exports: [HelpDeskService],
})
export class HelpDeskModule {}