import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';

import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';

import { ConsolidatedSalaryController } from './consolidated-salary/consolidated-salary.controller';
import { ConsolidatedSalaryService } from './consolidated-salary/consolidated-salary.service';

import { ComplianceOverviewController } from './compliance-overview/compliance-overview.controller';
import { ComplianceOverviewService } from './compliance-overview/compliance-overview.service';

@Module({
  imports: [
    DatabaseModule,
  ],

  controllers: [
    DashboardController,
    ConsolidatedSalaryController,
    ComplianceOverviewController,
  ],

  providers: [
    DashboardService,
    ConsolidatedSalaryService,
    ComplianceOverviewService,
  ],
})
export class GroupCompanyDetailsModule {}