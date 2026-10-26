import { Module } from '@nestjs/common';
//import { TalenthubattendanceModule } from './attendance/talenthub.attendance.module';
//import { TalenthubleaveModule } from './leave/talenthub.leave.module';
import { DailyModule } from './leave/daily/daily.module';
// import { ForceLeaveApprovalModule } from './leave/forceleaveapproval/forceleaveapproval.module';
// //import { TalenthubtimeofficeModule } from './timeoffice/talenthub.timeoffice.module';
// import { PunchProcessModule } from './timeoffice/punchprocess/punchprocess.module';
 
 
@Module({
    imports: [
        // TalenthubattendanceModule,
        // TalenthubleaveModule,
        DailyModule,
 
        // TalenthubtimeofficeModule
 
 
    ],
})
 
export class TalenthubModule {}
 
