import { Module } from '@nestjs/common';

import { AssignController } from './assign.controller';
import { AssignService } from './assign.service';

import { DatabaseModule } from '../../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AssignController],
  providers: [AssignService],
})
export class AssignModule {}