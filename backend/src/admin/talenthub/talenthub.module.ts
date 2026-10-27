import { Module } from '@nestjs/common';
import { DailyModule } from './leave/daily/daily.module';
import { ForceLeaveApprovalModule } from './leave/forceleaveapproval/forceleaveapproval.module';

@Module({
	imports: [DailyModule, ForceLeaveApprovalModule],
})
export class TalenthubModule {}
