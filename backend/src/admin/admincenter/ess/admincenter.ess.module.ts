import { Module } from '@nestjs/common';
import { AdmincenterEssCircularModule } from './circular/admincenter.ess.circular.module';
//import { AdmincenterEssPolicyModule } from './policy/admincenter.ess.policy.module';
//import { NotificationModule } from './notification/admincenter.ess.notification.module';
// import { PollsModule } from './polls/admincenter.ess.polls.module';
import { HelpDeskService } from './help-desk/admincenter.ess.helpdesk.service';
import { HelpDeskController } from './help-desk/admincenter.ess.helpdesk.controller';
import { HelpDeskModule } from './help-desk/admincenter.ess.helpdesk.module';

@Module({
  imports: [
    AdmincenterEssCircularModule,
    HelpDeskModule,
    //NotificationModule,
    //PollsModule,
    //AdmincenterEssPolicyModule,
  ],
  providers: [HelpDeskService],
  controllers: [HelpDeskController],
})
export class AdmincenterEssModule {}