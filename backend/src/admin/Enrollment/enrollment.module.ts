import { Module } from '@nestjs/common';
import { BackgroundVerificationModule } from './backgroundverification/background-verification.module';
import { BulkUpdateModule } from './bulkupdate/bulk-update.module';
import { EmployeeForceApprovalModule } from './employeeforceapproval/employee-force-approval.module';
import { PreEnrollmentModule } from './preenrollment/pre-enrollment.module';
import { SeparationModule } from './separation/separation.module';

@Module({
  imports: [
    BackgroundVerificationModule,
    BulkUpdateModule,
    EmployeeForceApprovalModule,
    PreEnrollmentModule,
    SeparationModule,
  ],
})
export class EnrollmentModule {}
