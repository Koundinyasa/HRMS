import { Module } from '@nestjs/common';
import { DailyModule } from './leave/daily/daily.module';
import { ForceLeaveApprovalModule } from './leave/forceleaveapproval/forceleaveapproval.module';
import { PunchProcessModule } from './timeoffice/punchprocess/punchprocess.module';

@Module({
	imports: [DailyModule, ForceLeaveApprovalModule, PunchProcessModule],
})
export class TalenthubModule {}
