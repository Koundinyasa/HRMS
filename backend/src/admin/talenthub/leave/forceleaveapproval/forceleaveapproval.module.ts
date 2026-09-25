import { Module } from '@nestjs/common';
import { ForceLeaveApprovalController } from './forceleaveapproval.controller';
import { ForceLeaveApprovalService } from './forceleaveapproval.service';
import { DatabaseModule } from '../../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ForceLeaveApprovalController],
  providers: [ForceLeaveApprovalService],
})
export class ForceLeaveApprovalModule {}
