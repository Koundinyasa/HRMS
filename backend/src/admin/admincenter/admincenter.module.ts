import { Module } from '@nestjs/common';
import { AdmincentercompanyModule } from './company/admincenter.company.module';
import { AdmincenterSettingModule } from './setting/admincenter.setting.module';
import { AdmincenterClassificationModule } from './classification/admincenter.classification.module';
import { EmployeeDetailsModule } from './employee-details/employee-details.module';
// import { AdmincenterUserManagementModule } from './usermanagement/admincenter.usermanagement.module';
// import { AdmincenterEssModule } from './ess/admincenter.ess.module';
// import { AdmincenterWorkFlowsModule } from './workflows/admincenter.workflows.module';
// import { AdmincenteradminConfigModule } from './adminconfig/admincenter.adminconfig.module';

import { EssModule } from './ess/ess.module';
@Module({
  imports: [
    AdmincentercompanyModule,
    AdmincenterSettingModule,
    AdmincenterClassificationModule,
    EmployeeDetailsModule,
    // AdmincenterUserManagementModule,
    // AdmincenterEssModule,
    // AdmincenterWorkFlowsModule,
    // AdmincenteradminConfigModule,
     EssModule,
 
  ],
})
export class AdmincenterModule {}
