import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';

import { GroupCompanyDetailsModule } from './details/group-company-details.module';
// import { ApprovalsModule } from './approvals/approvals.module';

@Module({
  imports: [
    DatabaseModule,
    GroupCompanyDetailsModule,
    // ApprovalsModule,
  ],
})
export class GroupOfCompanyModule {}