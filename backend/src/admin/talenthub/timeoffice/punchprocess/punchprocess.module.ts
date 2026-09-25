import { Module } from '@nestjs/common';

import { PunchProcessController } from './punchprocess.controller';

import { PunchProcessService } from './punchprocess.service';

import { DatabaseModule } from '../../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PunchProcessController],
  providers: [PunchProcessService],
})
export class PunchProcessModule {}
