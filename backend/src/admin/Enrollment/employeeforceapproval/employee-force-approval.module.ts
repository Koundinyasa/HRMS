import { Module } from '@nestjs/common';
import { EmployeeForceApprovalController } from './employee-force-approval.controller';
import { EmployeeForceApprovalService } from './employee-force-approval.service';

@Module({
  controllers: [EmployeeForceApprovalController],
  providers: [EmployeeForceApprovalService],
})
export class EmployeeForceApprovalModule {}