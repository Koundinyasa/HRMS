import { Module } from '@nestjs/common';
 
import { DailyModule } from './daily/daily.module';
//import { ForceLeaveApprovalModule } from './forceleaveapproval/forceleaveapproval.module';
@Module({
  imports: [
    DailyModule,//ForceLeaveApprovalModule
  ],
})
export class LeaveModule {}