import { Module } from '@nestjs/common';
import { AdmincentercompanyModule } from './company/admincenter.company.module';
import { AdmincenterSettingModule } from './setting/admincenter.setting.module';
import { AdmincenterClassificationModule } from './classification/admincenter.classification.module';
// import { AdmincenterUserManagementModule } from './usermanagement/admincenter.usermanagement.module';
// import { AdmincenterEssModule } from './ess/admincenter.ess.module';
// import { AdmincenterWorkFlowsModule } from './workflows/admincenter.workflows.module';
// import { AdmincenteradminConfigModule } from './adminconfig/admincenter.adminconfig.module';

@Module({
  imports: [
    AdmincentercompanyModule,
    AdmincenterSettingModule,
    AdmincenterClassificationModule,
    // AdmincenterUserManagementModule,
    // AdmincenterEssModule,
    // AdmincenterWorkFlowsModule,
    // AdmincenteradminConfigModule,
  ],
})
export class AdmincenterModule {}
