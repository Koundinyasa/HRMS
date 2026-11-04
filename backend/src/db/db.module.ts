import { Module } from '@nestjs/common';
import { HrmsDbService } from './hrms-db.service';

@Module({
  imports: [],
  providers: [HrmsDbService],
  exports: [HrmsDbService],
})
export class DbModule {}
